import React, { useState } from 'react';
import BudgetForm from '../components/BudgetForm';
import BudgetTracker from '../components/BudgetTracker';
import NotificationAlert from '../components/NotificationAlert';
import AnimatedButton from '../components/AnimatedButton';

const BudgetingTools = () => {
  const [budget, setBudget] = useState(1000); // Example placeholder
  const [spent, setSpent] = useState(1000); // Example value
  const [notification, setNotification] = useState('');

  const handleSetBudget = (newBudget) => {
    setBudget(newBudget);
    setNotification('');
  };

  const checkBudgetLimit = () => {
    if (spent > budget) {
      setNotification('You have exceeded your budget!');
    }
    else if(spent == budget){
      setNotification('You have hit your budget!');
    }
    else if (spent > budget * 0.9) {
      setNotification('You are nearing your budget limit!');
    } 
    
    else{
      setNotification('You are fine for now.');
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gradient-to-br from-gray-900 to-black-900 min-h-screen">
      <h1 className="text-4xl text-white font-bold mb-6 mt-9">Budgeting Tools</h1>
      <div className="flex-col items-center p-4 ">
      <BudgetForm onSubmit={handleSetBudget} />
      </div>
      <div className="flex-col items-center p-4 ">
      {budget && <BudgetTracker budget={budget} spent={spent} />}
      {notification && <NotificationAlert message={notification} />}

      <AnimatedButton
        label="Check Budget Status"
        onClick={checkBudgetLimit}
        buttonColor="blue"
        textColor="white"
      />
      </div>
    </div>
  );
};

export default BudgetingTools;
