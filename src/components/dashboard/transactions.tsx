"use client";
import React, { useEffect, useState } from "react";
import { TabsContent } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, Search } from "lucide-react";
import useBillStore from "@/store/useBillStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useBill from "@/hooks/use-bill";
import { Input } from "../ui/input";
import { IBiill } from "@/interfaces/IBill";

// Define interfaces


interface Props {
  handleOpenDialog: (data: string) => void;
}

// Simple CSS-based spinner component (replace with your UI library's spinner if available)
const Spinner: React.FC = () => (
  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
);

const Transactions: React.FC<Props> = () => {
  const { bills, initalize } = useBillStore();
  const router = useRouter();
  const { loading: globalLoading, getBill } = useBill();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredBills, setFilteredBills] = useState<IBiill[]>([]);
  const [printingBillId, setPrintingBillId] = useState<string | null>(null); // Track which bill is being printed
  const [isCreatingBill, setIsCreatingBill] = useState<boolean>(false); // Track Create Bill navigation

  useEffect(() => {
    initalize();
  }, [initalize]);

  // Update filtered bills whenever bills or searchQuery changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredBills(bills || []);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = (bills || []).filter((bill: IBiill) =>
      bill?.invoiceNo?.toLowerCase().includes(lowerCaseQuery) ||
      bill.customer.name.toLowerCase().includes(lowerCaseQuery) ||
      formatDate(bill.customer.billDate.toString()).toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredBills(filtered);
  }, [bills, searchQuery]);

  // Format date string
  const formatDate = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Calculate tax amount
  const calculateTax = (total: number): string => {
    return `₹${total.toFixed(2)}`;
  };

  const handlePrint = async (id: string) => {
    if (globalLoading || printingBillId) return; // Prevent multiple clicks
    setPrintingBillId(id); // Set loading state for this bill
    try {
      await getBill(id);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setPrintingBillId(null); // Clear loading state
    }
  };

  const handleCreateBill = () => {
    if (isCreatingBill) return; // Prevent multiple clicks
    setIsCreatingBill(true); // Set loading state for navigation
    router.push("/create-bill");
    // Note: We don't clear isCreatingBill here because navigation is handled by the router
    // If you need to clear it, you might do so in a useEffect or after navigation completes
  };

  return (
    <TabsContent value="transactions">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transactions</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search by invoice, customer, or date"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="pl-8 w-[250px]"
              />
            </div>
            <Button onClick={handleCreateBill} disabled={isCreatingBill}>
              {isCreatingBill ? (
                <>
                  <Spinner />
                  <span className="ml-2">Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Bill
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="px-4 py-3 text-left">Invoice</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Tax</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills && filteredBills.length !== 0 ? (
                  filteredBills.map((transaction: IBiill) => (
                    <tr key={transaction._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{transaction.invoiceNo}</td>
                      <td className="px-4 py-3">{transaction.customer.name}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(transaction.customer.billDate.toString())}
                      </td>
                      <td className="px-4 py-3 text-right">₹{transaction.summary.total}</td>
                      <td className="px-4 py-3 text-right">
                        {calculateTax(Number(transaction.summary.total))}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => router.push(`/create-bill/${transaction?._id}`)}
                            disabled={printingBillId === transaction._id}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handlePrint(transaction?._id ?? "" )}
                            disabled={printingBillId === transaction._id}
                          >
                            {printingBillId === transaction._id ? (
                              <Spinner />
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                />
                              </svg>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-3 text-center text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default Transactions;