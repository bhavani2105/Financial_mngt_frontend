import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth APIs
export const login = (email, password) =>
  api.post("/auth/login", { email, password });

export const register = (name, email, password, currency) =>
  api.post("/auth/register", { name, email, password, currency });

export const getProfile = () => api.get("/auth/profile");

// Transaction APIs
export const getTransactions = (filters = {}) =>
  api.get("/transactions", { params: filters });

export const getTransactionById = (id) => api.get(`/transactions/${id}`);

export const createTransaction = (data) => api.post("/transactions", data);

export const updateTransaction = (id, data) =>
  api.put(`/transactions/${id}`, data);

export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

export const getTransactionSummary = () => api.get("/transactions/summary");

// Budget APIs
export const getBudgets = (month, year) =>
  api.get("/budgets", { params: { month, year } });

export const createBudget = (data) => api.post("/budgets", data);

export const updateBudget = (id, data) => api.put(`/budgets/${id}`, data);

export const deleteBudget = (id) => api.delete(`/budgets/${id}`);

export const getBudgetSummary = (month, year) =>
  api.get("/budgets/summary", { params: { month, year } });

// Investment APIs
export const getInvestments = () => api.get("/investments");

export const createInvestment = (data) => api.post("/investments", data);

export const updateInvestment = (id, data) =>
  api.put(`/investments/${id}`, data);

export const deleteInvestment = (id) => api.delete(`/investments/${id}`);

// Liability APIs
export const getLiabilities = () => api.get("/liabilities");

export const createLiability = (data) => api.post("/liabilities", data);

export const updateLiability = (id, data) =>
  api.put(`/liabilities/${id}`, data);

export const deleteLiability = (id) => api.delete(`/liabilities/${id}`);

export default api;
