const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const { protect } = require('../middleware/authMiddleware');
const moment = require('moment'); // Import moment.js

router.get('/finance-overview', protect, async (req, res) => {
  try {
    const currentDate = moment().startOf('month');
    const nextMonth = moment().add(1, 'month').startOf('month');

    const expenses = await Expense.aggregate([
      { $match: { user: req.user._id, date: { $gte: currentDate.toDate(), $lt: nextMonth.toDate() } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);

    const incomes = await Income.aggregate([
      { $match: { user: req.user._id, date: { $gte: currentDate.toDate(), $lt: nextMonth.toDate() } } },
      { $group: { _id: '$source', total: { $sum: '$amount' } } },
    ]);

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.total, 0) || 0;
    const totalIncomes = incomes.reduce((sum, income) => sum + income.total, 0) || 0;
    const net = totalIncomes - totalExpenses;

    res.json({ expenses, incomes, totalExpenses, totalIncomes, net });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
