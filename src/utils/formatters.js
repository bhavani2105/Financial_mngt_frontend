import { format } from "date-fns";

export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date) => {
  return format(new Date(date), "MMM dd, yyyy");
};

export const formatDateTime = (date) => {
  return format(new Date(date), "MMM dd, yyyy HH:mm");
};

export const getCurrencySymbol = (currencyCode) => {
  const symbols = {
    USD: "$",
    IND:"₹",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CAD: "C$",
    AUD: "A$",
  };
  return symbols[currencyCode] || currencyCode;
};

export const calculatePercentage = (part, total) => {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
};

export const getProgressColor = (percentage) => {
  if (percentage < 60) return "bg-green-500";
  if (percentage < 80) return "bg-yellow-500";
  if (percentage < 90) return "bg-orange-500";
  return "bg-red-500";
};
