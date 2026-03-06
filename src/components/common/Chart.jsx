import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const Chart = ({ type = "line", data, options, title }) => {
  const defaultOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: !!title,
        text: title,
      },
    },
    maintainAspectRatio: false,
  };

  const mergedOptions = { ...defaultOptions, ...options };

  const renderChart = () => {
    switch (type) {
      case "line":
        return <Line data={data} options={mergedOptions} />;
      case "bar":
        return <Bar data={data} options={mergedOptions} />;
      case "pie":
        return <Pie data={data} options={mergedOptions} />;
      case "doughnut":
        return <Doughnut data={data} options={mergedOptions} />;
      default:
        return <Line data={data} options={mergedOptions} />;
    }
  };

  return (
    <div className="w-full h-full">
      <div className="h-64 sm:h-72 md:h-80">{renderChart()}</div>
    </div>
  );
};

// Helper function to create transaction chart data
export const createTransactionChartData = (transactions, currency = "USD") => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }).reverse();

  const incomeData = Array(7).fill(0);
  const expenseData = Array(7).fill(0);

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const dayIndex = Math.floor(
      (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (dayIndex >= 0 && dayIndex < 7) {
      if (transaction.type === "income") {
        incomeData[6 - dayIndex] += transaction.amount;
      } else {
        expenseData[6 - dayIndex] += transaction.amount;
      }
    }
  });

  return {
    labels: last7Days,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.5)",
      },
      {
        label: "Expenses",
        data: expenseData,
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.5)",
      },
    ],
  };
};

// Helper function to create budget chart data
export const createBudgetChartData = (budgets) => {
  const labels = budgets.map((budget) => budget.category);
  const limits = budgets.map((budget) => budget.limit);
  const spent = budgets.map((budget) => budget.spent);

  return {
    labels,
    datasets: [
      {
        label: "Budget Limit",
        data: limits,
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
      {
        label: "Amount Spent",
        data: spent,
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 1,
      },
    ],
  };
};

// Helper function to create category distribution data
export const createCategoryChartData = (transactions, type = "expense") => {
  const categoryTotals = {};

  transactions
    .filter((t) => t.type === type)
    .forEach((transaction) => {
      categoryTotals[transaction.category] =
        (categoryTotals[transaction.category] || 0) + transaction.amount;
    });

  const categories = Object.keys(categoryTotals);
  const amounts = Object.values(categoryTotals);

  const colors = [
    "rgb(239, 68, 68)", // Red
    "rgb(59, 130, 246)", // Blue
    "rgb(34, 197, 94)", // Green
    "rgb(245, 158, 11)", // Yellow
    "rgb(168, 85, 247)", // Purple
    "rgb(236, 72, 153)", // Pink
    "rgb(20, 184, 166)", // Teal
    "rgb(249, 115, 22)", // Orange
  ];

  return {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: colors.slice(0, categories.length),
        borderColor: colors.slice(0, categories.length),
        borderWidth: 1,
      },
    ],
  };
};

export default Chart;
