import { symbol } from "zod/v4";

export const TRANSACTION_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Other Income",
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Education",
  "Bills & Utilities",
  "Housing",
  "Travel",
  "Other Expense",
];

export const BUDGET_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Education",
  "Bills & Utilities",
  "Housing",
  "Travel",
  "Other",
];

export const INVESTMENT_TYPES = [
  { value: "stocks", label: "Stocks" },
  { value: "bonds", label: "Bonds" },
  { value: "mutual_funds", label: "Mutual Funds" },
  { value: "real_estate", label: "Real Estate" },
  { value: "crypto", label: "Cryptocurrency" },
  { value: "other", label: "Other" },
];

export const LIABILITY_TYPES = [
  { value: "loan", label: "Loan" },
  { value: "credit_card", label: "Credit Card" },
  { value: "mortgage", label: "Mortgage" },
  { value: "other", label: "Other" },
];

export const PAYMENT_METHODS = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "Digital Wallet",
  "Other",
];

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  {code:"IND",symbol:"₹",name:"Indian Rupees"},
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
];
