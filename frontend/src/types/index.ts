// Receipt Types
export interface Receipt {
  id: string;
  merchant: string;
  date: string;
  amount: number;
  category: string;
  notes?: string;
  imageUrl?: string;
  items?: ReceiptItem[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

// Form Types
export interface ReceiptFormValues {
  merchant: string;
  date: string;
  amount: string;
  category: string;
  notes?: string;
}

// Filter Types
export interface ReceiptFilters {
  search: string;
  category: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  sortBy: 'date' | 'amount' | 'merchant';
  sortOrder: 'asc' | 'desc';
}

// Chart Data Types
export interface MonthlyExpense {
  month: string;
  amount: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  color: string;
}

// User Settings
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  dateFormat: string;
}
