import api from "./api";

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response;
};

export const register = async (name, email, password, currency) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
    currency,
  });
  return response;
};

export const logout = () => {
  // Clear local storage
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
