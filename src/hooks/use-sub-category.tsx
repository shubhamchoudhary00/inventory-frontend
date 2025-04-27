"use client";
import apiClient from "@/utils/apiClient";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ISubCategory } from "@/interfaces/ISubCategory";

// Define interface for ISubCategory data

// Define interface for API error response
interface ApiErrorResponse {
  message?: string;
}

// Define the return type of the hook
interface UseSubCategoryReturn {
  data: ISubCategory[] | null;
  loading: boolean;
  error: string | null;
  fetchSubCategory: () => Promise<ISubCategory[] | undefined>;
  addSubCategory: (payload: Partial<ISubCategory>) => Promise<ISubCategory | Error>;
}

const useSubCategory = (): UseSubCategoryReturn => {
  const [data, setData] = useState<ISubCategory[] | null>(null);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubCategory = async (): Promise<ISubCategory[] | undefined> => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<ISubCategory[]>("/sub-category");
      setData(res.data);
      return res.data;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(error.response?.data?.message || "Failed to fetch subcategories");
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addSubCategory = async (payload: Partial<ISubCategory>): Promise<ISubCategory | Error> => {
    try {
      const res = await apiClient.post<ISubCategory>("/sub-category", payload);
      return res.data;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(error.response?.data?.message || "Failed to add subcategory");
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
        return error;
      }
      return new Error("Unknown error occurred");
    }
  };

  return { data, error, loading, addSubCategory, fetchSubCategory };
};

export default useSubCategory;