// routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const User = require('../models/User'); // Import User model
const { protect } = require('../middleware/authMiddleware');

// Get all expenses for a user
router.get('/get', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Add a new expense
router.post('/add', protect, async (req, res) => {
  const { category, amount, date } = req.body;

  if (!category || !amount || !date) {
    return res.status(400).json({ message: 'Please include all fields' });
  }

  try {
    const expense = new Expense({ user: req.user._id, category, amount, date });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Delete an expense
router.delete('/delete/:id', protect, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Update an expense
router.put('/update/:id', protect, async (req, res) => {
  const { category, amount, date } = req.body;

  if (!category || !amount || !date) {
    return res.status(400).json({ message: 'Please include all fields' });
  }

  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this expense' });
    }
    expense.category = category;
    expense.amount = amount;
    expense.date = date;
    await expense.save();
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get finance overview
router.get('/finance-overview', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const expenses = await Expense.find({ user: req.user._id });
    const totalSpendings = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    res.json({ totalSpendings, monthlyBudget: user.monthlyBudget, savingGoals: user.savingGoals });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

const mongoose = require('mongoose');

// Helper function to map categories to overarching categories
const categoryGroups = {
  "Essentials": [
    "Food",
    "Groceries/Home Supplies",
    "House Bills",
    "Education fees",
    "Loan payment",
    "Services/Hired Help",
    "Emergency"
  ],
  "Lifestyle": [
    "Entertainment/Luxury",
    "Travel",
    "Furniture",
    "Miscellaneous"
  ]
};

function getOverarchingCategory(category) {
  for (const [group, categories] of Object.entries(categoryGroups)) {
    if (categories.includes(category)) {
      return group;
    }
  }
  return "Other";
}

// Monthly expense totals grouped by category for selected year
router.get('/category-trend/:year', protect, async (req, res) => {
  try {
    const year = parseInt(req.params.year, 10) || new Date().getFullYear();
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const pipeline = [
      { $match: { user: mongoose.Types.ObjectId(req.user._id), date: { $gte: startDate, $lt: endDate } } },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            category: "$category"
          },
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $group: {
          _id: "$_id.month",
          categories: {
            $push: {
              category: "$_id.category",
              totalAmount: "$totalAmount"
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const results = await Expense.aggregate(pipeline);

    // Format data for frontend: array of months with category totals
    const formatted = results.map(monthData => {
      const month = monthData._id;
      const categories = monthData.categories.reduce((acc, curr) => {
        acc[curr.category] = curr.totalAmount;
        return acc;
      }, {});
      return { month, categories };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Hierarchical expense data grouped by overarching category and category
router.get('/hierarchical-spending', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });

    // Aggregate totals by category
    const totalsByCategory = {};
    expenses.forEach(expense => {
      const overarching = getOverarchingCategory(expense.category);
      if (!totalsByCategory[overarching]) {
        totalsByCategory[overarching] = {};
      }
      if (!totalsByCategory[overarching][expense.category]) {
        totalsByCategory[overarching][expense.category] = 0;
      }
      totalsByCategory[overarching][expense.category] += expense.amount;
    });

    // Format data for sunburst/treemap chart
    const data = {
      name: "Expenses",
      children: Object.entries(totalsByCategory).map(([overarching, categories]) => ({
        name: overarching,
        children: Object.entries(categories).map(([category, amount]) => ({
          name: category,
          value: amount
        }))
      }))
    };

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
