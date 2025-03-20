// models/Income.js
const mongoose = require('mongoose');

const incomeSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  source: {
    type: String,
    required: true,
    enum: [
      "bonus",
      "primary salary",
      "investment returns",
      "fixed deposit/interest",
      "rental income",
      "business profit",
      "gift money",
      "royalty income",
      "other"
    ]
  },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

const Income = mongoose.model('Income', incomeSchema);
module.exports = Income;
