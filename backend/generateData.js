(async () => {
  const fetch = (await import('node-fetch')).default;

  const expenseCategories = [
    "Food", "Entertainment/Luxury", "Travel", "Furniture", "Emergency",
    "Groceries/Home Supplies", "Education fees", "House Bills",
    "Services/Hired Help", "Loan payment", "Miscellaneous"
  ];

  const expenseAmounts = {
    "Travel": [100, 250, 500],
    "Food": [75, 300, 700],
    "Entertainment/Luxury": [300, 400, 600],
    "Furniture": [500, 1200, 2500],
    "Emergency": [200, 800, 2000],
    "Groceries/Home Supplies": [150, 400, 900],
    "Education fees": [1000, 3000, 8000],
    "House Bills": [200, 500, 1000],
    "Services/Hired Help": [100, 250, 600],
    "Loan payment": [500, 1000, 3000],
    "Miscellaneous": [50, 200, 500]
  };

  const generateAmount = (peaks) => {
    const peak = peaks[Math.floor(Math.random() * peaks.length)];
    return Math.max(0, peak + (Math.floor(Math.random() * 101) - 50));
  };

  const incomes = [
    { source: 'bonus', amount: 4000, frequency: 8 },
    { source: 'fixed deposit/interest', amount: 2200, frequency: 1 }
  ];

  const giftMonths = new Set();
  while (giftMonths.size < 2 + Math.floor(Math.random() * 2)) {
    giftMonths.add(Math.floor(Math.random() * 12) + 1);
  }

  const generateData = async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDY0NGMxZThmM2IyYWM4NWFmNzViOCIsImlhdCI6MTc0NTI0MTI5MiwiZXhwIjoxNzQ1MjQ0ODkyfQ.b90HAPQReVZh92tn8JJB28fp95_cDw21LFzwBfc3HUo';

    for (let month = 1; month <= 12; month++) {
      let monthlyExpenses = [];
      let totalExpense = 0;

      for (let i = 0; i < 10; i++) {
        let category = Object.keys(expenseAmounts)[Math.floor(Math.random() * Object.keys(expenseAmounts).length)];
        let amount = generateAmount(expenseAmounts[category]);
        if (totalExpense + amount <= 8000) {
          monthlyExpenses.push({ category, amount });
          totalExpense += amount;
        }
      }

      for (let i = 0; i < 4; i++) {
        let category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
        let amount = Math.floor(Math.random() * 500) + 50;
        if (totalExpense + amount <= 8000) {
          monthlyExpenses.push({ category, amount });
          totalExpense += amount;
        }
      }

      for (const expense of monthlyExpenses) {
        const expenseData = {
          category: expense.category,
          amount: expense.amount,
          date: new Date(2025, month - 1, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        };

        await fetch('http://localhost:8000/api/expenses/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(expenseData),
        });
      }
    }

    for (let month = 1; month <= 12; month++) {
      for (const income of incomes) {
        const incomeData = {
          source: income.source,
          amount: income.amount,
          date: new Date(2025, month - 1, income.frequency).toISOString().split('T')[0],
        };
        await fetch('http://localhost:8000/api/incomes/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(incomeData),
        });
      }

      if (giftMonths.has(month)) {
        const incomeData = {
          source: 'gift money',
          amount: 8000,
          date: new Date(2025, month - 1, 15).toISOString().split('T')[0],
        };
        await fetch('http://localhost:8000/api/incomes/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(incomeData),
        });
      }
    }
  };

  generateData()
    .then(() => console.log('Data generation complete.'))
    .catch((error) => console.error('Error generating data:', error));
})();
