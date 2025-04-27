"use client";
import apiClient from "@/utils/apiClient";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ICategory } from "@/interfaces/ICategory";

// Define interface for ICategory data

// Define interface for API response
interface FetchCategoryResponse {
  data: ICategory[];
}

// Define interface for API error response
interface ApiErrorResponse {
  message?: string;
}

// Define the return type of the hook
interface UseCategoryReturn {
  data: ICategory[] | null;
  loading: boolean;
  error: string | null;
  fetchCategory: () => Promise<ICategory[] | undefined>;
  addCategory: (name: string) => Promise<ICategory | Error>;
}

const useCategory = (): UseCategoryReturn => {
  const [data, setData] = useState<ICategory[] | null>(null);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = async (): Promise<ICategory[] | undefined> => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<FetchCategoryResponse>("/category");
      setData(res.data.data);
      return res.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(error.response?.data?.message || "Failed to fetch categories");
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addCategory = async (name: string): Promise<ICategory | Error> => {
    try {
      const res = await apiClient.post<ICategory>("/category", { name });
      return res.data;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(error.response?.data?.message || "Failed to add category");
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
        return error;
      }
      return new Error("Unknown error occurred");
    }
  };

  return { data, error, loading, addCategory, fetchCategory };
};

export default useCategory;