// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";

import { Tabs,  TabsList, TabsTrigger } from "@/components/ui/tabs";

import Overview from "@/components/dashboard/overview";
import Analytics from "@/components/dashboard/analytics";
import Products from "@/components/dashboard/products";
import Transactions from "@/components/dashboard/transactions";
import Customer from "@/components/dashboard/customer";
import AccountSettings from "@/components/dashboard/settings";
import { useRouter } from "next/navigation";
import useStore from "@/store/useStore";


export default function Dashboard() {
  const { activeTab, setActiveTab, setOpenDialog } = useStore() ;
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Ensure localStorage is only accessed on the client
  useEffect(() => {
    setIsClient(true); // Mark as client-side after mount
  }, []);

  // Check token and redirect if not authenticated
  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
      }
    }
  }, [isClient, router]);

  const handleOpenDialog = (dialogName: string) => {
    setOpenDialog(dialogName);
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      {/* <Sidebar 
    /> */}
      {/* Main Content */}
      <main className={`flex-1 lg:ml-64`}>
        <div className="container mx-auto p-4 lg:p-8">
          {/* Header */}
          <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            {/* <div className="flex items-center gap-2">
              <Select defaultValue="today">
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="last3Months">Last 3 Months</SelectItem>
                  <SelectItem value="thisYear">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Clock className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Dashboard Settings</SheetTitle>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Display Options</Label>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="showRevenue"
                            defaultChecked
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor="showRevenue">Revenue</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="showTaxes"
                            defaultChecked
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor="showTaxes">Taxes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="showTransactions"
                            defaultChecked
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor="showTransactions">
                            Recent Transactions
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="defaultView">Default View</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger id="defaultView">
                          <SelectValue placeholder="Select default view" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select defaultValue="inr">
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                          <SelectItem value="usd">US Dollar ($)</SelectItem>
                          <SelectItem value="eur">Euro (€)</SelectItem>
                          <SelectItem value="gbp">British Pound (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Button>Save Settings</Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div> */}
          </header>

          {/* Tab Content */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8 grid w-full grid-cols-2 lg:flex lg:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              {/* <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger> */}
            </TabsList>

            <Overview />

            
            <Analytics />

            <Products handleOpenDialog={handleOpenDialog} />

            <Transactions handleOpenDialog={handleOpenDialog} />

            <Customer />

            <AccountSettings handleOpenDialog={handleOpenDialog} />
          </Tabs>
        </div>
      </main>
    </div>
  );
}