import React, { createContext, useState, useContext, useEffect } from "react";
import {
  getTransactions,
  createTransaction as apiCreateTransaction,
  updateTransaction as apiUpdateTransaction,
  deleteTransaction as apiDeleteTransaction,
  getTransactionSummary,
  getBudgets,
  createBudget as apiCreateBudget,
  updateBudget as apiUpdateBudget,
  deleteBudget as apiDeleteBudget,
  getBudgetSummary,
  getInvestments,
  createInvestment as apiCreateInvestment,
  updateInvestment as apiUpdateInvestment,
  deleteInvestment as apiDeleteInvestment,
  getLiabilities,
  createLiability as apiCreateLiability,
  updateLiability as apiUpdateLiability,
  deleteLiability as apiDeleteLiability,
} from "../services/api";

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    transactionSummary: null,
    budgetSummary: null,
    investmentSummary: null,
    liabilitySummary: null,
  });
  const [loading, setLoading] = useState(false);

  // Transactions
  const fetchTransactions = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await getTransactions(filters);
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData) => {
    try {
      const newTransaction = await apiCreateTransaction(transactionData);
      setTransactions((prev) => [newTransaction, ...prev]);
      return newTransaction;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  };

  const updateTransaction = async (id, transactionData) => {
    try {
      const updated = await apiUpdateTransaction(id, transactionData);
      setTransactions((prev) => prev.map((t) => (t._id === id ? updated : t)));
      return updated;
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  };

  const removeTransaction = async (id) => {
    try {
      await apiDeleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  };

  // Budgets
  const fetchBudgets = async (month, year) => {
    setLoading(true);
    try {
      const data = await getBudgets(month, year);
      setBudgets(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  const addBudget = async (budgetData) => {
    try {
      const newBudget = await apiCreateBudget(budgetData);
      setBudgets((prev) => [...prev, newBudget]);
      return newBudget;
    } catch (error) {
      console.error("Error creating budget:", error);
      throw error;
    }
  };

  const updateBudget = async (id, budgetData) => {
    try {
      const updated = await apiUpdateBudget(id, budgetData);
      setBudgets((prev) => prev.map((b) => (b._id === id ? updated : b)));
      return updated;
    } catch (error) {
      console.error("Error updating budget:", error);
      throw error;
    }
  };

  const removeBudget = async (id) => {
    try {
      await apiDeleteBudget(id);
      setBudgets((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Error deleting budget:", error);
      throw error;
    }
  };

  // Investments
  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const data = await getInvestments();
      setInvestments(data.investments);
      setDashboardData((prev) => ({
        ...prev,
        investmentSummary: data.summary,
      }));
    } catch (error) {
      console.error("Error fetching investments:", error);
    } finally {
      setLoading(false);
    }
  };

  const addInvestment = async (investmentData) => {
    try {
      const newInvestment = await apiCreateInvestment(investmentData);
      setInvestments((prev) => [...prev, newInvestment]);
      return newInvestment;
    } catch (error) {
      console.error("Error creating investment:", error);
      throw error;
    }
  };

  // Liabilities
  const fetchLiabilities = async () => {
    setLoading(true);
    try {
      const data = await getLiabilities();
      setLiabilities(data.liabilities);
      setDashboardData((prev) => ({
        ...prev,
        liabilitySummary: data.summary,
      }));
    } catch (error) {
      console.error("Error fetching liabilities:", error);
    } finally {
      setLoading(false);
    }
  };

  // Dashboard Data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [transactionSummary, budgetSummary] = await Promise.all([
        getTransactionSummary(),
        getBudgetSummary(),
      ]);

      setDashboardData((prev) => ({
        ...prev,
        transactionSummary,
        budgetSummary,
      }));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    transactions,
    budgets,
    investments,
    liabilities,
    dashboardData,
    loading,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    removeTransaction,
    fetchBudgets,
    addBudget,
    updateBudget,
    removeBudget,
    fetchInvestments,
    addInvestment,
    updateInvestment: apiUpdateInvestment,
    deleteInvestment: apiDeleteInvestment,
    fetchLiabilities,
    addLiability: apiCreateLiability,
    updateLiability: apiUpdateLiability,
    deleteLiability: apiDeleteLiability,
    fetchDashboardData,
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
};
