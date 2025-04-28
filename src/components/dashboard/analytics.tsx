"use client";
import React, { useEffect } from "react";
import { TabsContent } from "../ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useDashboardStore from "@/store/useDashboardStore";

// Define interfaces for data structures
interface MonthWiseData {
  [month: string]: {
    withTax: number;
    withoutTax: number;
  };
}

interface CategoryWiseData {
  [category: string]: number;
}

interface GstWiseData {
  [gstRate: string]: number;
}


interface ChartData {
  name: string;
  withTax?: number;
  withoutTax?: number;
  value?: number;
}

// Helper function to transform monthWise data for LineChart
const transformMonthWiseData = (monthWise?: MonthWiseData): ChartData[] => {
  if (!monthWise) return [];
  return Object.keys(monthWise).map((month) => ({
    name: month,
    withTax: monthWise[month].withTax || 0,
    withoutTax: monthWise[month].withoutTax || 0,
  }));
};

// Helper function to transform categoryWise data for BarChart
const transformCategoryWiseData = (
  categoryWise?: CategoryWiseData
): ChartData[] => {
  if (!categoryWise) return [];
  return Object.keys(categoryWise).map((category) => ({
    name: category,
    value: categoryWise[category] || 0,
  }));
};

// Helper function to transform gstWise data for BarChart
const transformGstWiseData = (gstWise?: GstWiseData): ChartData[] => {
  if (!gstWise) return [];
  return Object.keys(gstWise).map((gstRate) => ({
    name: `GST ${gstRate}%`,
    value: gstWise[gstRate] || 0,
  }));
};

const Analytics: React.FC = () => {
  const { analyticsData, initalize } = useDashboardStore();

  useEffect(() => {
    if (!analyticsData) {
      initalize();
    }
  }, [analyticsData, initalize]);

  // Transform analyticsData for charts
  const monthWiseData = transformMonthWiseData(analyticsData?.monthWise);
  const categoryWiseData = transformCategoryWiseData(analyticsData?.categoryWise);
  const gstWiseData = transformGstWiseData(analyticsData?.gstWise);

  return (
    <TabsContent value="analytics">
      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sales Trend</CardTitle>
            {/* <Select defaultValue="monthly">
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select> */}
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthWiseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="withTax"
                    name="With Tax"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="withoutTax"
                    name="Without Tax"
                    stroke="#82ca9d"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={categoryWiseData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tax Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gstWiseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TabsContent>
  );
};

export default Analytics;