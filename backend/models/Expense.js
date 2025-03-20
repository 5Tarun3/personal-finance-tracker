// models/Expense.js
const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: {
    type: String,
    required: true,
    enum: [
      "Food",
      "Entertainment/Luxury",
      "Travel",
      "Furniture",
      "Emergency",
      "Groceries/Home Supplies",
      "Education fees",
      "House Bills",
      "Services/Hired Help",
      "Loan payment",
      "Miscellaneous"
    ]
  },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
