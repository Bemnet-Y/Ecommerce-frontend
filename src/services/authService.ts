import api from "./api";
import type { User, RegisterData } from "../types";

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const registerUser = async (
  userData: RegisterData
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", userData);
  return response.data;
};

export const getCurrentUser = async (): Promise<{
  success: boolean;
  data: { user: User };
}> => {
  const response = await api.get("/auth/me");
  return response.data;
};
