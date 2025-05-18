import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Receipt, Category, ReceiptFilters } from '@/types';

// Mock categories for initial development
const initialCategories: Category[] = [
  { id: '1', name: 'Groceries', color: '#4CAF50' },
  { id: '2', name: 'Dining', color: '#FF9800' },
  { id: '3', name: 'Transportation', color: '#2196F3' },
  { id: '4', name: 'Entertainment', color: '#9C27B0' },
  { id: '5', name: 'Shopping', color: '#F44336' },
  { id: '6', name: 'Utilities', color: '#607D8B' },
  { id: '7', name: 'Healthcare', color: '#00BCD4' },
  { id: '8', name: 'Other', color: '#9E9E9E' },
];

// Mock receipts for initial development
const initialReceipts: Receipt[] = [
  { 
    id: '1', 
    merchant: 'Walmart', 
    date: '2023-10-15', 
    amount: 56.78, 
    category: 'Groceries',
    notes: 'Weekly grocery shopping',
    imageUrl: 'https://placehold.co/300x400/png',
    createdAt: '2023-10-15T12:00:00Z',
    updatedAt: '2023-10-15T12:00:00Z',
    items: [
      { id: '1-1', name: 'Milk', price: 3.99 },
      { id: '1-2', name: 'Bread', price: 2.49 },
      { id: '1-3', name: 'Eggs', price: 4.99 },
    ]
  },
  { 
    id: '2', 
    merchant: 'Amazon', 
    date: '2023-10-12', 
    amount: 129.99, 
    category: 'Shopping',
    createdAt: '2023-10-12T14:30:00Z',
    updatedAt: '2023-10-12T14:30:00Z',
  },
  { 
    id: '3', 
    merchant: 'Starbucks', 
    date: '2023-10-10', 
    amount: 5.45, 
    category: 'Dining',
    createdAt: '2023-10-10T09:15:00Z',
    updatedAt: '2023-10-10T09:15:00Z',
  },
  { 
    id: '4', 
    merchant: 'Shell', 
    date: '2023-10-08', 
    amount: 45.00, 
    category: 'Transportation',
    createdAt: '2023-10-08T17:45:00Z',
    updatedAt: '2023-10-08T17:45:00Z',
  },
];

// Default filters
const defaultFilters: ReceiptFilters = {
  search: '',
  category: '',
  sortBy: 'date',
  sortOrder: 'desc',
};

interface ReceiptState {
  receipts: Receipt[];
  categories: Category[];
  filters: ReceiptFilters;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addReceipt: (receipt: Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReceipt: (id: string, updates: Partial<Receipt>) => void;
  deleteReceipt: (id: string) => void;
  setFilters: (filters: Partial<ReceiptFilters>) => void;
  resetFilters: () => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

export const useReceiptStore = create<ReceiptState>()(
  persist(
    (set) => ({
      receipts: initialReceipts,
      categories: initialCategories,
      filters: defaultFilters,
      isLoading: false,
      error: null,

      // Receipt actions
      addReceipt: (receiptData) => set((state) => {
        const newReceipt: Receipt = {
          ...receiptData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return { receipts: [...state.receipts, newReceipt] };
      }),

      updateReceipt: (id, updates) => set((state) => ({
        receipts: state.receipts.map((receipt) => 
          receipt.id === id 
            ? { ...receipt, ...updates, updatedAt: new Date().toISOString() } 
            : receipt
        ),
      })),

      deleteReceipt: (id) => set((state) => ({
        receipts: state.receipts.filter((receipt) => receipt.id !== id),
      })),

      // Filter actions
      setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters },
      })),

      resetFilters: () => set(() => ({
        filters: defaultFilters,
      })),

      // Category actions
      addCategory: (categoryData) => set((state) => {
        const newCategory: Category = {
          ...categoryData,
          id: crypto.randomUUID(),
        };
        return { categories: [...state.categories, newCategory] };
      }),

      updateCategory: (id, updates) => set((state) => ({
        categories: state.categories.map((category) => 
          category.id === id ? { ...category, ...updates } : category
        ),
      })),

      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
      })),
    }),
    {
      name: 'receipt-storage',
    }
  )
);

// Selector hooks for specific parts of the state
export const useReceipts = () => useReceiptStore((state) => state.receipts);
export const useCategories = () => useReceiptStore((state) => state.categories);
export const useFilters = () => useReceiptStore((state) => state.filters);
