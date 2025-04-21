const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/authMiddleware');
const moment = require('moment');

router.get('/monthwise-net/:year?', protect, async (req, res) => {
  try {
    const year = parseInt(req.params.year, 10) || new Date().getFullYear();
    const currentDate = moment(`${year}-01-01`, 'YYYY-MM-DD');
    const netData = [];

    for (let i = 0; i < 12; i++) {
      const monthStart = currentDate.clone().startOf('month');
      const monthEnd = currentDate.clone().endOf('month');

      const expenses = await Expense.aggregate([
        {
          $match: {
            user: req.user._id,
            date: { $gte: monthStart.toDate(), $lte: monthEnd.toDate() },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);

      const incomes = await Income.aggregate([
        {
          $match: {
            user: req.user._id,
            date: { $gte: monthStart.toDate(), $lte: monthEnd.toDate() },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);

      const totalExpenses = expenses.length > 0 ? expenses[0].total : 0;
      const totalIncomes = incomes.length > 0 ? incomes[0].total : 0;
      const net = totalIncomes - totalExpenses;
      netData.push({ month: monthStart.format('MMMM'), net });
      currentDate.add(1, 'month');
    }
    res.json(netData);
  } catch (error) {
    console.error('Error fetching monthwise net:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});
// Get all income for a user
router.get('/get', protect, async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Add a new income
router.post('/add', protect, async (req, res) => {
  const { source, amount, date } = req.body;

  if (!source || !amount || !date) {
    return res.status(400).json({ message: 'Please include all fields' });
  }

  try {
    const income = new Income({ user: req.user._id, source, amount, date });
    await income.save();
    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Delete an income
router.delete('/delete/:id', protect, async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }
    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this income' });
    }
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: 'Income deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Update an income
router.put('/update/:id', protect, async (req, res) => {
  const { source, amount, date } = req.body;

  if (!source || !amount || !date) {
    return res.status(400).json({ message: 'Please include all fields' });
  }

  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }
    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this income' });
    }
    income.source = source;
    income.amount = amount;
    income.date = date;
    await income.save();
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});
router.get('/total', protect, async (req, res) => {
  try {
    const totalIncome = await Income.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    res.json({ totalIncome: totalIncome[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});
module.exports = router;
