//server.js config
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const financeOverviewRoutes = require('./routes/financeOverviewRoutes'); // Import the new route

dotenv.config();

connectDB();

const app = express();

const allowedOrigins = ['https://finflow-sigma.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // if you're sending cookies
}));

app.use(express.json()); // Middleware for JSON parsing

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/users', userRoutes); // For user registration and login
app.use('/api/expenses', expenseRoutes); // For expenses
app.use('/api/incomes', incomeRoutes); // For incomes
app.use('/api', financeOverviewRoutes); // Mount the new route at /api
app.get('/api/users/register', (req, res) => {
  res.send('Hello from backend!');
});

const PORT = process.env.PORT || 8000;

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
