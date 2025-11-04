import api from "./api";

export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories");
  return response.data.data;
};

export const createCategory = async (categoryData: {
  name: string;
  description: string;
  image: string;
}): Promise<Category> => {
  const response = await api.post("/categories", categoryData);
  return response.data.data;
};
