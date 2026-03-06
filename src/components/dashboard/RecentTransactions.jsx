import React, { useEffect } from "react";
import { useFinance } from "../../context/FinanceContext";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

const RecentTransactions = () => {
  const { transactions, fetchTransactions } = useFinance();
  const { user } = useAuth();

  useEffect(() => {
    fetchTransactions({ limit: 5 });
  }, []);

  return (
    <div className="flow-root">
      <ul className="-my-5 divide-y divide-gray-200">
        {transactions.slice(0, 5).map((transaction) => (
          <li key={transaction._id} className="py-4">
            <div className="flex items-center space-x-4">
              <div
                className={`shrink-0 p-2 rounded-full ${
                  transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {transaction.type === "income" ? (
                  <ArrowUpIcon className="w-5 h-5 text-green-600" />
                ) : (
                  <ArrowDownIcon className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {transaction.description || transaction.category}
                </p>
                <p className="text-sm text-gray-500">
                  {transaction.category} • {formatDate(transaction.date)}
                </p>
              </div>
              <div className="shrink-0">
                <p
                  className={`text-sm font-semibold ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount, user?.currency)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {transactions.length === 0 && (
        <p className="py-4 text-center text-gray-500">No transactions yet</p>
      )}
    </div>
  );
};

export default RecentTransactions;
