export type Trip = {
  id: string;
  name: string;
  contributionPerPerson: number;
};

export type Contribution = {
  id: string;
  amount: number;
  createdAt: string;
};

export type Member = {
  id: string;
  name: string;
  amountPaid: number;
  contributions: Contribution[];
};

export type ExpenseCategory =
  | "ACCOMMODATION"
  | "FOOD"
  | "DRINKS"
  | "TRANSPORT"
  | "ENTERTAINMENT"
  | "OTHER";

export type Expense = {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
};