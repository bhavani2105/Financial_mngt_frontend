import React, { useEffect } from "react";
import { useFinance } from "../context/FinanceContext";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/formatters";
import StatsCard from "../components/dashboard/StatsCard";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import BudgetProgress from "../components/dashboard/BudgetProgress";
import LoadingSpinner from "../components/common/LoadingSpinner";
import IncomeExpenseChart from "../components/dashboard/IncomeExpenseChart";
import ReceiptScanner from "../components/dashboard/ReceiptScanner";

import {
  ArrowUpIcon,
  ArrowDownIcon,
  BanknotesIcon,
  CreditCardIcon,
  ChartBarIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  // const { dashboardData, fetchDashboardData, loading } = useFinance();


  // const { dashboardData, fetchDashboardData, loading, transactions } = useFinance();



  const {
  dashboardData,
  fetchDashboardData,
  fetchTransactions,
  loading,
  transactions,
} = useFinance();



  const { user } = useAuth();

  // useEffect(() => {
  //   fetchDashboardData();
  // }, []);





//    const getMonthlyData = () => {
//   const monthlyData = {};

//   transactions.forEach((txn) => {
//     const date = new Date(txn.date);
//     const month = date.toLocaleString("default", { month: "short" });

//     if (!monthlyData[month]) {
//       monthlyData[month] = { month, income: 0, expense: 0 };
//     }

//     if (txn.type === "income") {
//       monthlyData[month].income += txn.amount;
//     } else {
//       monthlyData[month].expense += txn.amount;
//     }
//   });

//   return Object.values(monthlyData);
// };

// const chartData = getMonthlyData();







// useEffect(() => {
//   if (!dashboardData?.transactionSummary) {
//     fetchDashboardData();
//   }
// }, [dashboardData, fetchDashboardData]);


//last one
// useEffect(() => {
//   fetchDashboardData();
//   fetchTransactions();
// }, [fetchDashboardData, fetchTransactions]);

  


useEffect(() => {
  fetchDashboardData();
  fetchTransactions();
}, []);





  // if (loading) {
  //   return <LoadingSpinner />;
  // }


if (loading && !dashboardData?.transactionSummary) {
  return <LoadingSpinner />;
}



  const { transactionSummary, budgetSummary } = dashboardData;




  const getMonthlyData = () => {
  if (!transactions || transactions.length === 0) return [];

  const monthlyData = {};

  transactions.forEach((txn) => {
    if (!txn.date) return;

    const date = new Date(txn.date);
    const month = date.toLocaleString("default", { month: "short" });

    if (!monthlyData[month]) {
      monthlyData[month] = { month, income: 0, expense: 0 };
    }

    if (txn.type === "income") {
      monthlyData[month].income += Number(txn.amount);
    } else {
      monthlyData[month].expense += Number(txn.amount);
    }
  });

  return Object.values(monthlyData);
};


const chartData = getMonthlyData();





 // 🔔 Budget Alert Logic
// const getBudgetAlert = () => {
//   if (!budgetSummary?.budgets) return null;

//   return budgetSummary.budgets.find((budget) => {
//     if (!budget.totalBudget || budget.totalBudget === 0) return false;

//     const usage = budget.totalSpent / budget.totalBudget;
//     return usage >= 0.8; // 80% threshold
//   });
// };

// const alertBudget = getBudgetAlert();







const getBudgetAlert = () => {
  if (!budgetSummary?.budgets || budgetSummary.budgets.length === 0)
    return null;

  return budgetSummary.budgets.find((budget) => {
    if (!budget.totalBudget) return false;

    const usage = budget.totalSpent / budget.totalBudget;
    return usage >= 0.8;
  });
};

const alertBudget = getBudgetAlert();




  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">Here's your financial overview</p>
      </div>

       {/* 🔔 Budget Alert Banner */}
{alertBudget && (
  <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-yellow-800 font-medium">
        ⚠ You have used{" "}
        {Math.round(
          (alertBudget.totalSpent / alertBudget.totalBudget) * 100
        )}
        % of your {alertBudget.category} budget.
      </p>
    </div>
  </div>
)}

      

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Income"
          value={formatCurrency(
            transactionSummary?.income || 0,
            user?.currency,
          )}
          icon={ArrowUpIcon}
          iconColor="text-green-500"
          bgColor="bg-green-50"
          change="+12% from last month"
          changeColor="text-green-600"
        />
        <StatsCard
          title="Total Expenses"
          value={formatCurrency(
            transactionSummary?.expense || 0,
            user?.currency,
          )}
          icon={ArrowDownIcon}
          iconColor="text-red-500"
          bgColor="bg-red-50"
          change="+8% from last month"
          changeColor="text-red-600"
        />
        <StatsCard
          title="Net Balance"
          value={formatCurrency(
            (transactionSummary?.income || 0) -
              (transactionSummary?.expense || 0),
            user?.currency,
          )}
          icon={BanknotesIcon}
          iconColor="text-blue-500"
          bgColor="bg-blue-50"
          change="+5% from last month"
          changeColor="text-blue-600"
        />
        <StatsCard
          title="Budget Spent"
          // value={`${budgetSummary ? Math.round((budgetSummary.totalSpent / budgetSummary.totalBudget) * 100) : 0}%`}
 
//           value={`${
//   budgetSummary?.totalBudget > 0
//     ? Math.round((budgetSummary.totalSpent / budgetSummary.totalBudget) * 100)
//     : 0
// }%`}


value={`${
  budgetSummary?.totalBudget > 0
    ? Math.round((budgetSummary.totalSpent / budgetSummary.totalBudget) * 100)
    : 0
}%`}


 
          icon={ChartBarIcon}
          iconColor="text-purple-500"
          bgColor="bg-purple-50"
          change={`${formatCurrency(budgetSummary?.totalSpent || 0, user?.currency)} of ${formatCurrency(budgetSummary?.totalBudget || 0, user?.currency)}`}
        />
      </div>
      <IncomeExpenseChart data={chartData} />
      {/* <IncomeExpenseChart data={chartData} /> */}

<ReceiptScanner />


      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </h2>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              View All
            </button>
          </div>
          <RecentTransactions />
        </div>

        {/* Budget Progress */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Budget Progress
            </h2>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              Manage Budgets
            </button>
          </div>
          <BudgetProgress />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-3">
        <div className="p-4 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <WalletIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Savings Rate</p>
              <p className="text-lg font-semibold">25%</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCardIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Budgets</p>
              <p className="text-lg font-semibold">
                {budgetSummary?.budgets?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg Daily Spend</p>
              <p className="text-lg font-semibold">
                {formatCurrency(
                  (transactionSummary?.expense || 0) / 30,
                  user?.currency,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
