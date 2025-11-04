export interface User {
  _id: string;
  email: string;
  name: string;
  role: "customer" | "seller" | "admin";
  avatar?: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "customer" | "seller";
}
export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
}
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: Category;
  seller: {
    _id: string;
    name: string;
    email: string;
  };
  brand: string;
  sku: string;
  stock: number;
  isActive: boolean;
  features: string[];
  ingredients?: string;
  howToUse?: string;
  ratings: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}
