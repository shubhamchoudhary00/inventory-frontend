"use client";
import React, { useEffect, useState } from "react";
import { TabsContent } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  
  BarChart3,
  Box,
  LineChartIcon,
  Tag,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "../ui/button";
import useBillStore from "@/store/useBillStore";
import useDashboardStore from "@/store/useDashboardStore";
import { IBiill } from "@/interfaces/IBill";
import { useRouter } from "next/navigation";

// Define interfaces for data structures


interface MonthWiseData {
  withTax: number;
  withoutTax: number;
}

interface MonthWise {
  [key: string]: MonthWiseData;
}


interface ChartData {
  name: string;
  withTax: number;
  withoutTax: number;
}

const Overview: React.FC = () => {
  const { bills, initalize } = useBillStore();
  const router=useRouter()
  const { data, initalize: fetchSalesData,status } = useDashboardStore();
  const [currentMonth, setCurrentMonth] = useState<MonthWiseData | null>(null);
  const [monthWise, setMonthWise] = useState<MonthWise | null>(null);
  const [today, setToday] = useState<MonthWiseData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Format monthWise data for Recharts
  useEffect(() => {
    if (monthWise) {
      const formattedData = Object.keys(monthWise)
        .sort() // Sort by YYYY-MM
        .map((key) => {
          const [year, month] = key.split("-");
          const monthName = new Date(`${year}-${month}-01`).toLocaleString(
            "en-US",
            { month: "short" }
          );
          return {
            name: monthName,
            withTax: monthWise[key].withTax,
            withoutTax: monthWise[key].withoutTax,
          };
        });
      setChartData(formattedData);
    }
  }, [monthWise]);

  // Set state from dashboard data
  useEffect(() => {
    if (data) {
      // console.log(data);
      setCurrentMonth(data.currentMonth || null);
      setMonthWise(data.monthWise || null);
      setToday(data.today || null);
    }
  }, [data]);

  // Initialize data
  useEffect(() => {
    if (bills && data) return;
    initalize();
    fetchSalesData();
    
 
  }, [bills, data, initalize, fetchSalesData]);

  useEffect(()=>{
    if(status===401){
      localStorage.clear()
      router.push("/");
    }
  },[status]);

  // Format date for display
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

  return (
    <TabsContent value="overview">
      {/* Sales Overview Cards */}
      {currentMonth && today && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Today&apos;s Sales (with tax)
              </CardTitle>
              <Tag className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{today?.withTax?.toLocaleString("en-IN") || 0}
              </div>
              {/* <div className="text-xs text-muted-foreground flex items-center mt-1">
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">12%</span>
                <span className="ml-1">from yesterday</span>
              </div> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Today&apos;s Sales (without tax)
              </CardTitle>
              <Box className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{today?.withoutTax?.toLocaleString("en-IN") || 0}
              </div>
              {/* <div className="text-xs text-muted-foreground flex items-center mt-1">
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">10%</span>
                <span className="ml-1">from yesterday</span>
              </div> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Sales (with tax)
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{currentMonth?.withTax?.toLocaleString("en-IN") || 0}
              </div>
              {/* <div className="text-xs text-muted-foreground flex items-center mt-1">
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">18%</span>
                <span className="ml-1">from last month</span>
              </div> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Sales (without tax)
              </CardTitle>
              <LineChartIcon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{currentMonth?.withoutTax?.toLocaleString("en-IN") || 0}
              </div>
              {/* <div className="text-xs text-muted-foreground flex items-center mt-1">
                <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">15%</span>
                <span className="ml-1">from last month</span>
              </div> */}
            </CardContent>
          </Card>
        </div>
      )}

      {currentMonth && today && (
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Net Sales (Today)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">
                ₹{(today.withTax + today.withoutTax).toLocaleString("en-IN")}
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Total Revenue</span>
                  <span>
                    ₹{(today.withTax + today.withoutTax).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-gray-500">With Tax Amount</span>
                  <span className="text-gray-500">
                    ₹{today.withTax.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="mt-3 border-t pt-2 flex items-center justify-between font-medium">
                  <span>Without Tax</span>
                  <span>₹{today.withoutTax.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Net Sales (This Month)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">
                ₹{(currentMonth.withTax + currentMonth.withoutTax).toLocaleString(
                  "en-IN"
                )}
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Total Revenue</span>
                  <span>
                    ₹{(currentMonth.withTax + currentMonth.withoutTax).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-gray-500">With Tax Amount</span>
                  <span className="text-gray-500">
                    ₹{currentMonth.withTax.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="mt-3 border-t pt-2 flex items-center justify-between font-medium">
                  <span>Without Tax</span>
                  <span>
                    ₹{currentMonth.withoutTax.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) =>
                      `₹${value.toLocaleString("en-IN")}`
                    }
                  />
                  <Legend />
                  <Bar dataKey="withTax" name="With Tax" fill="#8884d8" />
                  <Bar dataKey="withoutTax" name="Without Tax" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
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
                  </tr>
                </thead>
                <tbody>
                  {bills && bills.length > 0 ? (
                    bills.slice(0, 5).map((transaction: IBiill) => (
                      <tr
                        key={transaction._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 font-medium">
                          {transaction.invoiceNo}
                        </td>
                        <td className="px-4 py-3">
                          {transaction.customer.name}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {formatDate(transaction.customer.billDate.toString())}
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          ₹{Number(transaction.summary.total).toLocaleString(
                            "en-IN"
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-3 text-center text-gray-500"
                      >
                        No transactions available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default Overview;