import React, { useState, useEffect } from "react";
import { useFinance } from "../context/FinanceContext";
import { useAuth } from "../context/AuthContext";
import { formatCurrency, formatDate } from "../utils/formatters";
import { LIABILITY_TYPES } from "../utils/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { liabilitySchema } from "../utils/validationSchemas";
import Modal from "../components/common/Modal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const Liabilities = () => {
  const {
    liabilities,
    loading,
    fetchLiabilities,
    addLiability,
    updateLiability,
    deleteLiability,
  } = useFinance();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLiability, setSelectedLiability] = useState(null);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    totalRemaining: 0,
    totalMonthlyPayment: 0,
  });

  const {
    register: formRegister,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(liabilitySchema),
    defaultValues: {
      type: "loan",
      interestRate: 0,
      monthlyPayment: 0,
    },
  });

  useEffect(() => {
    fetchLiabilities();
  }, []);

  useEffect(() => {
    if (liabilities.length > 0) {
      const calculatedSummary = liabilities.reduce(
        (acc, liability) => {
          acc.totalAmount += liability.totalAmount;
          acc.totalRemaining += liability.remainingAmount;
          acc.totalMonthlyPayment += liability.monthlyPayment;
          return acc;
        },
        { totalAmount: 0, totalRemaining: 0, totalMonthlyPayment: 0 },
      );
      setSummary(calculatedSummary);
    }
  }, [liabilities]);

  const handleFormSubmit = async (data) => {
    try {
      if (selectedLiability) {
        await updateLiability(selectedLiability._id, {
          ...data,
          totalAmount: parseFloat(data.totalAmount),
          remainingAmount: parseFloat(data.remainingAmount),
          interestRate: parseFloat(data.interestRate) || 0,
          monthlyPayment: parseFloat(data.monthlyPayment) || 0,
        });
        toast.success("Liability updated successfully");
      } else {
        await addLiability({
          ...data,
          totalAmount: parseFloat(data.totalAmount),
          remainingAmount: parseFloat(data.remainingAmount),
          interestRate: parseFloat(data.interestRate) || 0,
          monthlyPayment: parseFloat(data.monthlyPayment) || 0,
        });
        toast.success("Liability added successfully");
      }
      setIsModalOpen(false);
      setSelectedLiability(null);
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save liability");
    }
  };

  const handleEdit = (liability) => {
    setSelectedLiability(liability);
    reset({
      ...liability,
      totalAmount: parseFloat(liability.totalAmount),
      remainingAmount: parseFloat(liability.remainingAmount),
      interestRate: parseFloat(liability.interestRate) || 0,
      monthlyPayment: parseFloat(liability.monthlyPayment) || 0,
      dueDate: liability.dueDate
        ? new Date(liability.dueDate).toISOString().split("T")[0]
        : "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this liability?")) {
      try {
        await deleteLiability(id);
        toast.success("Liability deleted successfully");
      } catch (error) {
        toast.error("Failed to delete liability");
      }
    }
  };

  const calculateProgress = (liability) => {
    return (
      ((liability.totalAmount - liability.remainingAmount) /
        liability.totalAmount) *
      100
    );
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Liabilities</h1>
          <p className="text-gray-600">Manage your debts and loans</p>
        </div>
        <button
          onClick={() => {
            setSelectedLiability(null);
            reset({
              type: "loan",
              interestRate: 0,
              monthlyPayment: 0,
            });
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center justify-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Liability
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-600">Total Debt</p>
          <p className="text-2xl font-bold">
            {formatCurrency(summary.totalAmount, user?.currency)}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow border border-red-100">
          <p className="text-sm text-red-600">Remaining</p>
          <p className="text-2xl font-bold text-red-700">
            {formatCurrency(summary.totalRemaining, user?.currency)}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg shadow border border-orange-100">
          <p className="text-sm text-orange-600">Monthly Payment</p>
          <p className="text-2xl font-bold text-orange-700">
            {formatCurrency(summary.totalMonthlyPayment, user?.currency)}
          </p>
        </div>
      </div>

      {/* Liabilities List */}
      <div className="card">
        {loading ? (
          <LoadingSpinner />
        ) : liabilities.length > 0 ? (
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
                    Total Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remaining
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest Rate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Payment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {liabilities.map((liability) => {
                  const progress = calculateProgress(liability);
                  const overdue = isOverdue(liability.dueDate);

                  return (
                    <tr key={liability._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {liability.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {liability.description || "No description"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge bg-purple-100 text-purple-800">
                          {LIABILITY_TYPES.find(
                            (t) => t.value === liability.type,
                          )?.label || liability.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatCurrency(liability.totalAmount, user?.currency)}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(
                              liability.remainingAmount,
                              user?.currency,
                            )}
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {liability.interestRate > 0
                          ? `${liability.interestRate}%`
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {liability.monthlyPayment > 0
                          ? formatCurrency(
                              liability.monthlyPayment,
                              user?.currency,
                            )
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          {liability.dueDate ? (
                            <>
                              <span
                                className={`text-sm ${overdue ? "text-red-600 font-medium" : "text-gray-900"}`}
                              >
                                {formatDate(liability.dueDate)}
                              </span>
                              {overdue && (
                                <ExclamationTriangleIcon className="w-4 h-4 text-red-500 ml-1" />
                              )}
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">
                              No due date
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(liability)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(liability._id)}
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
            <CreditCardIcon className="w-12 h-12 mx-auto text-gray-400" />
            <p className="text-gray-500 mt-2">No liabilities found</p>
            <p className="text-sm text-gray-400 mt-1">
              Add loans, credit cards, or other debts to track
            </p>
          </div>
        )}
      </div>

      {/* Liability Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLiability(null);
          reset();
        }}
        title={selectedLiability ? "Edit Liability" : "Add New Liability"}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Liability Name *
              </label>
              <input
                type="text"
                {...formRegister("name")}
                className="input-field"
                placeholder="e.g., Car Loan, Credit Card"
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
                {LIABILITY_TYPES.map((type) => (
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
                Total Amount ({user?.currency}) *
              </label>
              <input
                type="number"
                step="0.01"
                {...formRegister("totalAmount", { valueAsNumber: true })}
                className="input-field"
                placeholder="0.00"
              />
              {errors.totalAmount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.totalAmount.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remaining Amount ({user?.currency}) *
              </label>
              <input
                type="number"
                step="0.01"
                {...formRegister("remainingAmount", { valueAsNumber: true })}
                className="input-field"
                placeholder="0.00"
              />
              {errors.remainingAmount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.remainingAmount.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                {...formRegister("interestRate", { valueAsNumber: true })}
                className="input-field"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Payment ({user?.currency})
              </label>
              <input
                type="number"
                step="0.01"
                {...formRegister("monthlyPayment", { valueAsNumber: true })}
                className="input-field"
                placeholder="0.00"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date (Optional)
              </label>
              <input
                type="date"
                {...formRegister("dueDate")}
                className="input-field"
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
              placeholder="Add details about this liability..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedLiability(null);
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
                : selectedLiability
                  ? "Update"
                  : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Liabilities;
