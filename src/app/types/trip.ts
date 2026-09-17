export type Trip = {
  id: string;
  name: string;
  contributionPerPerson: number;
};

export type Member = {
  id: string;
  name: string;
  amountPaid: number;
};

export type Expense = {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
};

export type ExpenseCategory =
  | "ACCOMMODATION"
  | "FOOD"
  | "DRINKS"
  | "TRANSPORT"
  | "ENTERTAINMENT"
  | "OTHER";