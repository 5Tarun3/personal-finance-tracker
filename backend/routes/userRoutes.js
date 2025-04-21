const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

// Email validation using regex
const emailRegex = "/^[\\w-\\.]+@[\\w-\\.]+(\\.\\w{2,3})+$/"; // Basic email validation regex

// Register a new user
router.post('/register', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
  body('passwordCheck').optional().custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
],
async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}
try {
  const { name, email, password, passwordCheck, googleLogin } = req.body;
  console.log(req.body); // Debugging log to check incoming request body

  if (!name || !email || (req.body.password && !passwordCheck)) {
    return res.status(400).json({ msg: "Not all fields have been entered" });
  }
  if (password !== passwordCheck) {
    return res.status(400).json({ msg: "Passwords do not match. Please try again" });
  }
  if (req.body.password && password.length < 5) {
    return res.status(400).json({ msg: "The password needs to be at least 5 characters long" });
  }

  // Check if email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }

  const newUser = new User({ name, email, password: googleLogin ? password : password });
  const savedUser = await newUser.save();

  if (savedUser) {
    res.status(201).json({ message: 'User registered successfully' });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
} catch (error) {
  console.error(error);
  res.status(500).json({ err: error.message });
}
});

// Login a user
router.post('/login', async (req, res) => {
try {
  const { email, password, googleLogin } = req.body;
  const user = await User.findOne({ email });
  
    if (!email || (!password && !googleLogin) || !req.body.name) {

    return res.status(400).json({ msg: "Not all fields have been entered" });
  }

  if (!user) {
    // Create a new user if they don't exist and it's a Google login
    if (googleLogin) {
      const newUser = new User({ name: req.body.name, email, password });

      await newUser.save(); // Save the new user to the database
    }
    return res.status(401).json({ message: 'User not found' });
  }

  if (user && await user.matchPassword(password)) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("Generated Token:", token); // Debugging log for generated token
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
} catch (error) {
  console.error(error);
  res.status(500).json({ err: error.message });
}
});
router.delete("/delete", protect, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: error.message });
  }
});

// validating if user is logged in by boolean check most useful for front-end
router.post("/tokenIsValid", protect, async (req, res) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get the token from the header
      token = req.headers.authorization.split(' ')[1];
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (verified) {
        return res.json(true);
      } else {
        return res.json(false);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ err: error.message });
    }
  } else {
    return res.json(false);
  }
});

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('name email');
    res.json({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: error.message });
  }
});

// This route is grabbing one user

router.get("/", protect, async (req,res) => {
  const user = await User.findById(req.user)
  res.json({
    firstName: user.firstName,
    lastName: user.lastName,
    id: user._id,
  })
});

// Update user saving goal
router.put('/savingGoal', protect, async (req, res) => {
  try {
    const { savingGoal } = req.body;
    if (!savingGoal) {
      return res.status(400).json({ error: 'Saving goal is required' });
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, { savingGoals: savingGoal }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating saving goal:', error);
    res.status(500).json({ error: 'Failed to update saving goal' });
  }
});

// Update user monthly budget
router.put('/monthlyBudget', protect, async (req, res) => {
  try {
    const { monthlyBudget } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { monthlyBudget }, { new: true });
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
