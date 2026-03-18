import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "smarthpp-db";
const DB_VERSION = 1;

export interface Transaction {
  id?: number;
  type: "pemasukan" | "pengeluaran";
  nominal: number;
  category: string;
  productName: string;
  date: string;
  note: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Product {
  id?: number;
  name: string;
}

export interface Category {
  id?: number;
  name: string;
  type: "pemasukan" | "pengeluaran";
}

export interface Target {
  id?: number;
  type: "profit" | "tabungan" | "omzet";
  value: number;
}

export interface Recurring {
  id?: number;
  nominal: number;
  category: string;
  note: string;
  date: string;
  type: "pemasukan" | "pengeluaran";
  recurringType: "bulanan";
}

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("transactions")) {
        db.createObjectStore("transactions", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("products")) {
        db.createObjectStore("products", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("categories")) {
        db.createObjectStore("categories", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("targets")) {
        db.createObjectStore("targets", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("recurring")) {
        db.createObjectStore("recurring", { keyPath: "id", autoIncrement: true });
      }
    },
  });
}

// Transactions
export async function addTransaction(t: Omit<Transaction, "id">): Promise<number> {
  const db = await getDB();
  return (await db.add("transactions", t)) as number;
}

export async function updateTransaction(t: Transaction): Promise<void> {
  const db = await getDB();
  await db.put("transactions", { ...t, updatedAt: Date.now() });
}

export async function deleteTransaction(id: number): Promise<void> {
  const db = await getDB();
  await db.delete("transactions", id);
}

export async function getAllTransactions(): Promise<Transaction[]> {
  const db = await getDB();
  const all = await db.getAll("transactions");
  return (all as Transaction[]).sort((a, b) => b.createdAt - a.createdAt);
}

// Products
export async function addProduct(p: Omit<Product, "id">): Promise<number> {
  const db = await getDB();
  return (await db.add("products", p)) as number;
}

export async function getAllProducts(): Promise<Product[]> {
  const db = await getDB();
  return db.getAll("products") as Promise<Product[]>;
}

export async function deleteProduct(id: number): Promise<void> {
  const db = await getDB();
  await db.delete("products", id);
}

// Categories
export async function addCategory(c: Omit<Category, "id">): Promise<number> {
  const db = await getDB();
  return (await db.add("categories", c)) as number;
}

export async function getAllCategories(): Promise<Category[]> {
  const db = await getDB();
  return db.getAll("categories") as Promise<Category[]>;
}

export async function deleteCategory(id: number): Promise<void> {
  const db = await getDB();
  await db.delete("categories", id);
}

// Targets
export async function saveTarget(t: Target): Promise<void> {
  const db = await getDB();
  if (t.id) {
    await db.put("targets", t);
  } else {
    await db.add("targets", t);
  }
}

export async function getAllTargets(): Promise<Target[]> {
  const db = await getDB();
  return db.getAll("targets") as Promise<Target[]>;
}

export async function deleteTarget(id: number): Promise<void> {
  const db = await getDB();
  await db.delete("targets", id);
}

// Recurring
export async function addRecurring(r: Omit<Recurring, "id">): Promise<number> {
  const db = await getDB();
  return (await db.add("recurring", r)) as number;
}

export async function getAllRecurring(): Promise<Recurring[]> {
  const db = await getDB();
  return db.getAll("recurring") as Promise<Recurring[]>;
}

export async function deleteRecurring(id: number): Promise<void> {
  const db = await getDB();
  await db.delete("recurring", id);
}

// Generate recurring transactions for current month
export async function generateRecurringTransactions(): Promise<void> {
  const db = await getDB();
  const recurrings = await getAllRecurring();
  const transactions = await getAllTransactions();
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  for (const r of recurrings) {
    const alreadyExists = transactions.some(
      (t) =>
        t.note === `[Rutin] ${r.note}` &&
        t.date.startsWith(currentMonth)
    );
    if (!alreadyExists) {
      await db.add("transactions", {
        type: r.type,
        nominal: r.nominal,
        category: r.category,
        productName: "",
        date: `${currentMonth}-01`,
        note: `[Rutin] ${r.note}`,
        tags: ["rutin"],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  }
}
