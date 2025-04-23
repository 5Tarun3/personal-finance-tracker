import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const FinancialOverview = ({ user }) => {
  const financialData = user.financialData || [];
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded">
          <p className="text-sm text-gray-600">Total Income</p>
          <p className="text-xl font-bold">${user.totalIncome ? user.totalIncome.toLocaleString() : 0}</p>

        </div>
        <div className="bg-red-100 p-4 rounded">
          <p className="text-sm text-gray-600">Total Expenses</p>
          <p className="text-xl font-bold">${user.totalExpenses ? user.totalExpenses.toLocaleString() : 0}</p>

        </div>
        <div className="bg-blue-100 p-4 rounded">
          <p className="text-sm text-gray-600">Net Worth</p>
          <p className="text-xl font-bold">${user.netWorth ? user.netWorth.toLocaleString() : 0}</p>

        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={financialData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="income" stroke="#8884d8" />
          <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
