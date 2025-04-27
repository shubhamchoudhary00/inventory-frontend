"use client";
import apiClient from "@/utils/apiClient";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { IUom } from "@/interfaces/IUom";

// Define interface for Unit of Measure (UOM) data


// Define interface for API error response
interface ApiErrorResponse {
  message?: string;
}

// Define the return type of the hook
interface UseUomReturn {
  data: IUom[] | null;
  loading: boolean;
  error: string | null;
  fetchUom: () => Promise<IUom[] | undefined>;
  addUom: (payload: Partial<IUom>) => Promise<IUom | Error>;
}

const useUom = (): UseUomReturn => {
  const [data, setData] = useState<IUom[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUom = async (): Promise<IUom[] | undefined> => {
    setLoading(true);
    try {
      const res = await apiClient.get<IUom[]>("/uom");
      console.log(res.data);
      setData(res.data);
      return res.data;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(error.response?.data?.message || "Failed to fetch units of measure");
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const addUom = async (payload: Partial<IUom>): Promise<IUom | Error> => {
    try {
      const res = await apiClient.post<IUom>("/uom", payload);
      console.log(res.data);
      return res.data;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(error.response?.data?.message || "Failed to add unit of measure");
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
        return error;
      }
      return new Error("Unknown error occurred");
    }
  };

  return { data, error, loading, fetchUom, addUom };
};

export default useUom;