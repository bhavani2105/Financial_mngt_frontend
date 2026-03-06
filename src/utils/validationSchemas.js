import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    currency: z.string().default("USD"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required"),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().optional(),
  date: z
    .string()
    .or(z.date())
    .transform((str) => new Date(str))
    .default(() => new Date()),
  paymentMethod: z.string().default("Cash"),
});

export const budgetSchema = z.object({
  category: z.string().min(1, "Category is required"),
  limit: z.number().positive("Limit must be positive"),
  period: z.enum(["monthly", "weekly", "yearly"]).default("monthly"),
  month: z.number().min(1).max(12),
  year: z.number().min(2000).max(2100),
});

export const investmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum([
    "stocks",
    "bonds",
    "mutual_funds",
    "real_estate",
    "crypto",
    "other",
  ]),
  amount: z.number().positive("Amount must be positive"),
  currentValue: z.number().positive("Current value must be positive"),
  purchaseDate: z
    .string()
    .or(z.date())
    .transform((str) => new Date(str))
    .default(() => new Date()),
  returnRate: z.number().optional(),
  description: z.string().optional(),
});

export const liabilitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["loan", "credit_card", "mortgage", "other"]),
  totalAmount: z.number().positive("Total amount must be positive"),
  remainingAmount: z.number().positive("Remaining amount must be positive"),
  interestRate: z.number().min(0).max(100).optional(),
  dueDate: z
    .string()
    .or(z.date())
    .transform((str) => new Date(str))
    .default(() => new Date()),
  monthlyPayment: z.number().min(0).optional(),
  description: z.string().optional(),
});
