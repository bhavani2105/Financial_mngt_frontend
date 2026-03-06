import React, { useState, useEffect } from "react";
import { useFinance } from "../context/FinanceContext";
import { useAuth } from "../context/AuthContext";
import {
  formatCurrency,
  formatDate,
  calculatePercentage,
} from "../utils/formatters";
import { INVESTMENT_TYPES } from "../utils/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { investmentSchema } from "../utils/validationSchemas";
import Modal from "../components/common/Modal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const Investments = () => {
  const {
    investments,
    loading,
    fetchInvestments,
    addInvestment,
    updateInvestment,
    deleteInvestment,
  } = useFinance();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [summary, setSummary] = useState({
    totalInvested: 0,
    totalCurrentValue: 0,
    totalProfit: 0,
    totalReturn: 0,
  });

  const {
    register: formRegister,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      type: "stocks",
      purchaseDate: new Date().toISOString().split("T")[0],
      returnRate: 0,
    },
  });

  useEffect(() => {
    fetchInvestments();
  }, []);

  useEffect(() => {
    if (investments.length > 0) {
      const calculatedSummary = investments.reduce(
        (acc, investment) => {
          acc.totalInvested += investment.amount;
          acc.totalCurrentValue += investment.currentValue;
          acc.totalProfit += investment.currentValue - investment.amount;
          return acc;
        },
        {
          totalInvested: 0,
          totalCurrentValue: 0,
          totalProfit: 0,
          totalReturn: 0,
        },
      );

      calculatedSummary.totalReturn = calculatePercentage(
        calculatedSummary.totalProfit,
        calculatedSummary.totalInvested,
      );

      setSummary(calculatedSummary);
    }
  }, [investments]);

  const handleFormSubmit = async (data) => {
    try {
      if (selectedInvestment) {
        await updateInvestment(selectedInvestment._id, {
          ...data,
          amount: parseFloat(data.amount),
          currentValue: parseFloat(data.currentValue),
          returnRate: parseFloat(data.returnRate) || 0,
        });
        toast.success("Investment updated successfully");
      } else {
        await addInvestment({
          ...data,
          amount: parseFloat(data.amount),
          currentValue: parseFloat(data.currentValue),
          returnRate: parseFloat(data.returnRate) || 0,
        });
        toast.success("Investment added successfully");
      }
      setIsModalOpen(false);
      setSelectedInvestment(null);
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save investment");
    }
  };

  const handleEdit = (investment) => {
    setSelectedInvestment(investment);
    reset({
      ...investment,
      purchaseDate: new Date(investment.purchaseDate)
        .toISOString()
        .split("T")[0],
      amount: parseFloat(investment.amount),
      currentValue: parseFloat(investment.currentValue),
      returnRate: parseFloat(investment.returnRate) || 0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this investment?")) {
      try {
        await deleteInvestment(id);
        toast.success("Investment deleted successfully");
      } catch (error) {
        toast.error("Failed to delete investment");
      }
    }
  };

  const calculateInvestmentProfit = (investment) => {
    return investment.currentValue - investment.amount;
  };

  const calculateInvestmentReturn = (investment) => {
    return calculatePercentage(
      calculateInvestmentProfit(investment),
      investment.amount,
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investments</h1>
          <p className="text-gray-600">Track your investment portfolio</p>
        </div>
        <button
          onClick={() => {
            setSelectedInvestment(null);
            reset({
              type: "stocks",
              purchaseDate: new Date().toISOString().split("T")[0],
              returnRate: 0,
            });
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center justify-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Investment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-600">Total Invested</p>
          <p className="text-2xl font-bold">
            {formatCurrency(summary.totalInvested, user?.currency)}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-100">
          <p className="text-sm text-blue-600">Current Value</p>
          <p className="text-2xl font-bold text-blue-700">
            {formatCurrency(summary.totalCurrentValue, user?.currency)}
          </p>
        </div>
        <div
          className={`p-4 rounded-lg shadow border ${summary.totalProfit >= 0 ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}
        >
          <p
            className={`text-sm ${summary.totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            Total Profit/Loss
          </p>
          <p
            className={`text-2xl font-bold ${summary.totalProfit >= 0 ? "text-green-700" : "text-red-700"}`}
          >
            {formatCurrency(summary.totalProfit, user?.currency)}
          </p>
        </div>
        <div
          className={`p-4 rounded-lg shadow border ${summary.totalReturn >= 0 ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}
        >
          <p
            className={`text-sm ${summary.totalReturn >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            Total Return
          </p>
          <p
            className={`text-2xl font-bold ${summary.totalReturn >= 0 ? "text-green-700" : "text-red-700"}`}
          >
            {summary.totalReturn.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Investments List */}
      <div className="card">
        {loading ? (
          <LoadingSpinner />
        ) : investments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invested
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Value
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit/Loss
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Return
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchase Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {investments.map((investment) => {
                  const profit = calculateInvestmentProfit(investment);
                  const returnPercentage =
                    calculateInvestmentReturn(investment);

                  return (
                    <tr key={investment._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {investment.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {investment.description || "No description"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge bg-blue-100 text-blue-800">
                          {INVESTMENT_TYPES.find(
                            (t) => t.value === investment.type,
                          )?.label || investment.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatCurrency(investment.amount, user?.currency)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {formatCurrency(
                          investment.currentValue,
                          user?.currency,
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          {profit >= 0 ? (
                            <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                          ) : (
                            <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
                          )}
                          <span
                            className={`font-medium ${profit >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {formatCurrency(profit, user?.currency)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-medium ${returnPercentage >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {returnPercentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(investment.purchaseDate)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(investment)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(investment._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <ChartBarIcon className="w-12 h-12 mx-auto text-gray-400" />
            <p className="text-gray-500 mt-2">No investments found</p>
            <p className="text-sm text-gray-400 mt-1">
              Add your first investment to start tracking
            </p>
          </div>
        )}
      </div>

      {/* Investment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedInvestment(null);
          reset();
        }}
        title={selectedInvestment ? "Edit Investment" : "Add New Investment"}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Investment Name *
              </label>
              <input
                type="text"
                {...formRegister("name")}
                className="input-field"
                placeholder="e.g., Apple Stocks, Tesla Bonds"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select {...formRegister("type")} className="input-field">
                {INVESTMENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount Invested ({user?.currency}) *
              </label>
              <input
                type="number"
                step="0.01"
                {...formRegister("amount", { valueAsNumber: true })}
                className="input-field"
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Value ({user?.currency}) *
              </label>
              <input
                type="number"
                step="0.01"
                {...formRegister("currentValue", { valueAsNumber: true })}
                className="input-field"
                placeholder="0.00"
              />
              {errors.currentValue && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.currentValue.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Date *
              </label>
              <input
                type="date"
                {...formRegister("purchaseDate")}
                className="input-field"
              />
              {errors.purchaseDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.purchaseDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Return Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                {...formRegister("returnRate", { valueAsNumber: true })}
                className="input-field"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              {...formRegister("description")}
              rows={3}
              className="input-field"
              placeholder="Add details about this investment..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedInvestment(null);
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
                : selectedInvestment
                  ? "Update"
                  : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Investments;
