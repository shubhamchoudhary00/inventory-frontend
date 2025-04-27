"use client";
import apiClient from "@/utils/apiClient";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { IBiill } from "@/interfaces/IBill";


interface BillResponse {
  bill: IBiill;
  pdfData?: string; // Base64-encoded PDF data
  success:boolean
}

interface ApiErrorResponse {
  message?: string;
}

// Define the return type of the hook
interface UseBillReturn {
  loading: boolean;
  error: string | null;
  fetchBills: () => Promise<IBiill[] | undefined>;
  addBill: (payload: Partial<IBiill>) => Promise<BillResponse | undefined>;
  getBill: (id: string) => Promise<BillResponse | undefined>;
}

const useBill = (): UseBillReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBills = async (): Promise<IBiill[] | undefined> => {
    setLoading(true);
    try {
      const res = await apiClient.get<IBiill[]>("/bills");
      console.log(res.data);
      return res.data;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(error.response?.data?.message || "Failed to fetch bills");
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const addBill = async (payload: Partial<IBiill>): Promise<BillResponse | undefined> => {
    setLoading(true);
    try {
      const res = await apiClient.post<BillResponse>("/bills", payload);
      console.log(res.data);

      // Handle PDF download if available
      if (res.data.pdfData) {
        // Convert base64 to blob
        const pdfBlob = base64ToBlob(res.data.pdfData, "application/pdf");

        // Create a download link
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(pdfBlob);
        downloadLink.download = `invoice-${res.data.bill._id}.pdf`;

        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }

      return res.data;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(error.response?.data?.message || "Failed to create bill");
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getBill = async (id: string): Promise<BillResponse | undefined> => {
    setLoading(true);
    try {
      const res = await apiClient.get<BillResponse>(`/bills/${id}`);
      console.log("res", res.data);
      if (res.data.pdfData) {
        // Convert base64 to blob
        const pdfBlob = base64ToBlob(res.data.pdfData, "application/pdf");

        // Create a download link
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(pdfBlob);
        downloadLink.download = `invoice-${res.data.bill._id}.pdf`;

        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }

      return res.data;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(error.response?.data?.message || "Failed to fetch bill");
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert base64 to blob
  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteArrays: Uint8Array[] = [];

    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);

      const byteNumbers = new Array(slice.length);
      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  };

  return { loading, error, addBill, fetchBills, getBill };
};

export default useBill;