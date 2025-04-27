"use client";
import apiClient from "@/utils/apiClient";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { IProduct } from "@/interfaces/IProduct";

// Define interface for IProduct data

// Define interface for API error response (based on Axios error structure)
interface ApiErrorResponse {
  message?: string;
}

// Define the return type of the hook
interface UseProductsReturn {
  data: IProduct[] | null;
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<IProduct[] | undefined>;
  addProducts: (payload: Partial<IProduct>) => Promise<IProduct | Error>;
  updateProduct: (payload: Partial<IProduct>, id: string) => Promise<IProduct | Error>;
  deleteProduct: (id: string) => Promise<void | Error>;
}

const useProducts = (): UseProductsReturn => {
  const [data, setData] = useState<IProduct[] | null>(null);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (): Promise<IProduct[] | undefined> => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<IProduct[]>("/products");
      setData(res.data);
      return res.data;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addProducts = async (payload: Partial<IProduct>): Promise<IProduct | Error> => {
    try {
      const res = await apiClient.post<IProduct>("/products", payload);
      return res.data;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
        return error;
      }
      return new Error("Unknown error occurred");
    }
  };

  const updateProduct = async (payload: Partial<IProduct>, id: string): Promise<IProduct | Error> => {
    try {
      const res = await apiClient.put<IProduct>(`/products/${id}`, payload);
      return res.data;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
        return error;
      }
      return new Error("Unknown error occurred");
    }
  };

  const deleteProduct = async (id: string): Promise<void | Error> => {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
        return error;
      }
      return new Error("Unknown error occurred");
    }
  };

  return { data, error, loading, addProducts, fetchProducts, updateProduct, deleteProduct };
};

export default useProducts;