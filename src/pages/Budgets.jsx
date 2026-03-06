import React, { useState, useEffect } from "react";
import { useFinance } from "../context/FinanceContext";
import { useAuth } from "../context/AuthContext";
import {
  formatCurrency,
  calculatePercentage,
  getProgressColor,
} from "../utils/formatters";
import { BUDGET_CATEGORIES } from "../utils/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema } from "../utils/validationSchemas";
import Modal from "../components/common/Modal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const Budgets = () => {
  const {
    budgets,
    loading,
    fetchBudgets,
    addBudget,
    updateBudget,
    removeBudget,
    fetchDashboardData,
  } = useFinance();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const {
    register: formRegister,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      period: "monthly",
    },
  });

  useEffect(() => {
    fetchBudgets(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i,
  );

  const handleFormSubmit = async (data) => {
    try {
      if (selectedBudget) {
        await updateBudget(selectedBudget._id, {
          ...data,
          limit: parseFloat(data.limit),
        });
        toast.success("Budget updated successfully");
      } else {
        await addBudget({
          ...data,
          limit: parseFloat(data.limit),
        });
        toast.success("Budget added successfully");
      }
      setIsModalOpen(false);
      setSelectedBudget(null);
      reset();
      fetchDashboardData(); // Refresh dashboard data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save budget");
    }
  };

  const handleEdit = (budget) => {
    setSelectedBudget(budget);
    reset({
      ...budget,
      limit: parseFloat(budget.limit),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await removeBudget(id);
        toast.success("Budget deleted successfully");
        fetchDashboardData(); // Refresh dashboard data
      } catch (error) {
        toast.error("Failed to delete budget");
      }
    }
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPercentage = calculatePercentage(totalSpent, totalBudget);

  const getProgressBar = (percentage) => {
    const color = getProgressColor(percentage);
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${color} h-2.5 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-600">Plan and track your spending</p>
        </div>
        <button
          onClick={() => {
            setSelectedBudget(null);
            reset({
              month: selectedMonth,
              year: selectedYear,
              period: "monthly",
            });
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center justify-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Budget
        </button>
      </div>

      {/* Month/Year Selector */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
            <h3 className="font-medium text-gray-900">Select Period</h3>
          </div>
          <div className="flex space-x-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="input-field w-32"
            >
              {months.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="input-field w-32"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Overall Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-600">Total Budget</p>
          <p className="text-2xl font-bold">
            {formatCurrency(totalBudget, user?.currency)}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-100">
          <p className="text-sm text-blue-600">Total Spent</p>
          <p className="text-2xl font-bold text-blue-700">
            {formatCurrency(totalSpent, user?.currency)}
          </p>
        </div>
        <div
          className={`p-4 rounded-lg shadow border ${totalRemaining >= 0 ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}
        >
          <p
            className={`text-sm ${totalRemaining >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {totalRemaining >= 0 ? "Remaining" : "Overspent"}
          </p>
          <p
            className={`text-2xl font-bold ${totalRemaining >= 0 ? "text-green-700" : "text-red-700"}`}
          >
            {formatCurrency(Math.abs(totalRemaining), user?.currency)}
          </p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-900">Overall Progress</h3>
          <span className="text-sm font-medium">{overallPercentage}%</span>
        </div>
        {getProgressBar(overallPercentage)}
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Spent: {formatCurrency(totalSpent, user?.currency)}</span>
          <span>Budget: {formatCurrency(totalBudget, user?.currency)}</span>
        </div>
      </div>

      {/* Budgets List */}
      <div className="card">
        <h3 className="font-medium text-gray-900 mb-4">Budget Categories</h3>
        {loading ? (
          <LoadingSpinner />
        ) : budgets.length > 0 ? (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const percentage = calculatePercentage(
                budget.spent,
                budget.limit,
              );
              const remaining = budget.limit - budget.spent;

              return (
                <div
                  key={budget._id}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {budget.category}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {budget.period} • {months[budget.month - 1]}{" "}
                        {budget.year}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(budget)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(budget._id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">
                        Progress ({percentage}%)
                      </span>
                      <span className="font-medium">
                        {formatCurrency(budget.spent, user?.currency)} /{" "}
                        {formatCurrency(budget.limit, user?.currency)}
                      </span>
                    </div>
                    {getProgressBar(percentage)}
                  </div>

                  <div className="flex justify-between text-sm">
                    <span
                      className={`font-medium ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {remaining >= 0 ? "Remaining:" : "Overspent:"}{" "}
                      {formatCurrency(Math.abs(remaining), user?.currency)}
                    </span>
                    <span className="text-gray-600">
                      {budget.spent === 0
                        ? "No spending yet"
                        : `${Math.round(percentage)}% of budget used`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No budgets set for {months[selectedMonth - 1]} {selectedYear}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Create a budget to start tracking your spending
            </p>
          </div>
        )}
      </div>

      {/* Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBudget(null);
          reset();
        }}
        title={selectedBudget ? "Edit Budget" : "Create New Budget"}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select {...formRegister("category")} className="input-field">
                <option value="">Select Category</option>
                {BUDGET_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Period *
              </label>
              <select {...formRegister("period")} className="input-field">
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
              </select>
              {errors.period && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.period.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Limit ({user?.currency}) *
              </label>
              <input
                type="number"
                step="0.01"
                {...formRegister("limit", { valueAsNumber: true })}
                className="input-field"
                placeholder="0.00"
              />
              {errors.limit && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.limit.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month *
              </label>
              <select
                {...formRegister("month", { valueAsNumber: true })}
                className="input-field"
              >
                {months.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
              {errors.month && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.month.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year *
              </label>
              <select
                {...formRegister("year", { valueAsNumber: true })}
                className="input-field"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {errors.year && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.year.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedBudget(null);
                reset();
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting
                ? "Saving..."
                : selectedBudget
                  ? "Update"
                  : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Budgets;
