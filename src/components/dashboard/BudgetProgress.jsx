import React, { useEffect } from "react";
import { useFinance } from "../../context/FinanceContext";

import {
  formatCurrency,
  calculatePercentage,
  getProgressColor,
} from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";

const BudgetProgress = () => {
  const { budgets, fetchBudgets } = useFinance();
  const { user } = useAuth();

  useEffect(() => {
    const now = new Date();
    fetchBudgets(now.getMonth() + 1, now.getFullYear());
  }, []);

  const getProgressBar = (percentage) => {
    const color = getProgressColor(percentage);
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
    {/* {budgets.slice(0, 3).map((budget) => {
        const percentage = calculatePercentage(budget.spent, budget.limit);
        return (
          <div key={budget._id} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">
                {budget.category}
              </span>
              <span className="text-gray-600">
                {formatCurrency(budget.spent, user?.currency)} /{" "}
                {formatCurrency(budget.limit, user?.currency)}
              </span>
            </div>
            {getProgressBar(percentage)}
            <div className="flex justify-between text-xs text-gray-500">
              <span>{percentage}% used</span>
              <span>
                {formatCurrency(budget.limit - budget.spent, user?.currency)}{" "}
                remaining
              </span>
            </div>
          </div>
        );
      })}
      {budgets.length === 0 && (
        <p className="text-center text-gray-500">
          No budgets set for this month
        </p>
      )}  */}


      {/* {budgetSummary?.budgets?.map((budget) => { */}

     {budgets?.map((budget) => {
  const percentage =
    budget.limit > 0
      ? (budget.spent / budget.limit) * 100
      : 0;

  const remaining = budget.limit - budget.spent;

  return (
    <div key={budget._id} className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="font-medium">{budget.category}</span>
        <span className="text-sm text-gray-600">
          {formatCurrency(budget.spent, user?.currency)} /{" "}
          {formatCurrency(budget.limit, user?.currency)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 relative">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${
            percentage >= 100
              ? "bg-red-500"
              : percentage >= 80
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
          style={{
            width: `${Math.min(percentage, 100)}%`,
          }}
        />

        {/* Remaining Line */}
        <div
          className="absolute top-0 bottom-0 border-r-2 border-black"
          style={{
            left: `${Math.min(percentage, 100)}%`,
          }}
        />
      </div>

      <div className="text-sm mt-2 text-gray-600">
        Remaining: {formatCurrency(remaining, user?.currency)}
      </div>
    </div>
  );
})}

{budgets.length === 0 && (
  <p className="text-center text-gray-500">
    No budgets set for this month
  </p>
)}


    </div>
  );
};

export default BudgetProgress;
