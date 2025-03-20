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

module.exports = router;
