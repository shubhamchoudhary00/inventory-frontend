"use client";
import React, { useState, useEffect } from "react";
import { PlusCircle, ChevronLeft, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ReactSelect from "react-select";
import useProductStore from "@/store/useProductStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import useBill from "@/hooks/use-bill";
import { toast } from "sonner";
import { IBiill, IBillProduct, Items } from "@/interfaces/IBill";
import { IProduct } from "@/interfaces/IProduct";
import { IUom } from "@/interfaces/IUom";

// Define interfaces for data structures


interface ProductOption {
  value: string;
  label: string;
  price: number;
  gstRate: number;
  hsnSacCode: string;
  unitOfMeasure?: string;
}


interface CustomerData {
  name: string;
  contact: string;
  paymentMethod: string;
  billDate: string;
}

interface Taxes {
  sgst: number;
  cgst: number;
  igst: number;
}

interface BillSummary {
  subtotal: number;
  sgstTotal: number;
  cgstTotal: number;
  igstTotal: number;
  totalTax: number;
  total: number;
}



const CreateBillPage: React.FC = () => {
  const { products, loading,  refetch } = useProductStore();
  const [billType, setBillType] = useState<"local" | "interstate">("local");
  const [gstStatus, setGstStatus] = useState<"withGst" | "withoutGst">("withGst");
  const router = useRouter();
  const [items, setItems] = useState<Items[]>([{ product: null, quantity: 1 }]);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    contact: "",
    paymentMethod: "",
    billDate: new Date().toISOString().split("T")[0],
  });

  const { addBill } = useBill();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleAddItem = () => {
    setItems([...items, { product: null, quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      const updatedItems = [...items];
      updatedItems.splice(index, 1);
      setItems(updatedItems);
    }
  };

  const handleItemChange = (
    index: number,
    field: "product" | "quantity",
    value: IBillProduct | null | string
  ) => {
    const updatedItems = [...items];
    if (field === "product") {
      updatedItems[index] = { ...updatedItems[index], product: value as IBillProduct | null };
    } else if (field === "quantity") {
      updatedItems[index] = {
        ...updatedItems[index],
        quantity: parseInt(value as string) || 1,
      };
    }
    setItems(updatedItems);
  };

  const handleCustomerChange = (field: keyof CustomerData, value: string) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateItemTotal = (item: Items): number => {
    if (!item.product) return 0;
    const baseAmount = item.product.price * item.quantity;
    if (gstStatus === "withoutGst") return baseAmount;

    const gstAmount = (baseAmount * item.product.gstRate) / 100;
    return baseAmount + gstAmount;
  };

  const calculateTaxes = (item: Items): Taxes => {
    if (!item.product || gstStatus === "withoutGst") return { sgst: 0, cgst: 0, igst: 0 };

    const baseAmount = item.product.price * item.quantity;
    const gstAmount = (baseAmount * item.product.gstRate) / 100;

    if (billType === "local") {
      return {
        sgst: gstAmount / 2,
        cgst: gstAmount / 2,
        igst: 0,
      };
    }
    return {
      sgst: 0,
      cgst: 0,
      igst: gstAmount,
    };
  };

  const calculateBillSummary = (): BillSummary => {
    let subtotal = 0;
    let sgstTotal = 0;
    let cgstTotal = 0;
    let igstTotal = 0;

    items.forEach((item) => {
      if (!item.product) return;
      const baseAmount = item.product.price * item.quantity;
      subtotal += baseAmount;

      if (gstStatus === "withGst") {
        const taxes = calculateTaxes(item);
        sgstTotal += taxes.sgst;
        cgstTotal += taxes.cgst;
        igstTotal += taxes.igst;
      }
    });

    const totalTax = sgstTotal + cgstTotal + igstTotal;
    return {
      subtotal,
      sgstTotal,
      cgstTotal,
      igstTotal,
      totalTax,
      total: subtotal + totalTax,
    };
  };

  const productOptions: ProductOption[] = products && products?.map((product: IProduct) => ({
    value: product._id,
    label: `${product.productName}`,
    price: product.price,
    gstRate: product.gstRate,
    hsnSacCode: product.hsnSacCode,
    unitOfMeasure: (product.unitOfMeasure as IUom)?.uom_short,
  })) || [];

  const summary = calculateBillSummary();

  const handleSubmit = async () => {
    if (
      !customerData.name ||
      !customerData.contact ||
      !customerData.paymentMethod ||
      items.some((item) => !item.product)
    ) {
      alert("Please fill all required fields");
      return;
    }

    const payload: IBiill = {
      customer: customerData,
      items,
      billType,
      gstStatus,
      summary,
    };

    const res = await addBill(payload);
    console.log("res", res);

    if (res && res.success) {
      toast.success("Bill generated successfully");
      reset();
      return;
    }
    toast.error("Something went wrong");
  };

  const reset = () => {
    setCustomerData({
      name: "",
      contact: "",
      paymentMethod: "",
      billDate: new Date().toISOString().split("T")[0],
    });
    setItems([{ product: null, quantity: 1 }]);
  };

  const onCancel = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 lg:ml-64">
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold">Create New Bill</h1>
              <p className="text-gray-500 mt-1">Generate a new bill for customer purchase</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onCancel} className="flex items-center">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                Generate Bill
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4 md:col-span-2">
                  <h3 className="font-semibold mb-3">Customer Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Customer Name</Label>
                      <Input
                        id="customerName"
                        placeholder="Enter customer name"
                        value={customerData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleCustomerChange("name", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerContact">Contact Number</Label>
                      <Input
                        id="customerContact"
                        placeholder="Enter contact number"
                        value={customerData.contact}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleCustomerChange("contact", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select
                        onValueChange={(value: string) =>
                          handleCustomerChange("paymentMethod", value)
                        }
                        value={customerData.paymentMethod}
                      >
                        <SelectTrigger id="paymentMethod" className="mt-1">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="billDate">Bill Date</Label>
                      <Input
                        id="billDate"
                        type="date"
                        value={customerData.billDate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleCustomerChange("billDate", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                  <h3 className="font-semibold mb-3">Bill Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="block mb-2">Bill Type</Label>
                      <div className="flex gap-3">
                        <Button
                          variant={billType === "local" ? "default" : "outline"}
                          onClick={() => setBillType("local")}
                          size="sm"
                          className="flex-1"
                        >
                          Local
                        </Button>
                        <Button
                          variant={billType === "interstate" ? "default" : "outline"}
                          onClick={() => setBillType("interstate")}
                          size="sm"
                          className="flex-1"
                        >
                          Interstate
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="block mb-2">GST Treatment</Label>
                      <div className="flex gap-3">
                        <Button
                          variant={gstStatus === "withGst" ? "default" : "outline"}
                          onClick={() => setGstStatus("withGst")}
                          size="sm"
                          className="flex-1"
                        >
                          With GST
                        </Button>
                        <Button
                          variant={gstStatus === "withoutGst" ? "default" : "outline"}
                          onClick={() => setGstStatus("withoutGst")}
                          size="sm"
                          className="flex-1"
                        >
                          Without GST
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Products & Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 px-2 py-1">
                      <div className="col-span-6">Product</div>
                      <div className="col-span-1 text-center">Qty</div>
                      <div className="col-span-2 text-right">Unit Price</div>
                      <div className="col-span-2 text-right">Total</div>
                      <div className="col-span-1"></div>
                    </div>

                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-2 bg-gray-50 border border-gray-200 rounded-md p-2 items-center"
                      >
                        <div className="col-span-6">
                        <ReactSelect
                          options={productOptions}
                          value={item.product}
                          onChange={(value: ProductOption | null) =>
                            handleItemChange(index, "product", value as IBillProduct | null)
                          }
                          placeholder="Select product"
                          isClearable
                          isSearchable
                          className="text-sm"
                          classNamePrefix="react-select"
                          styles={{
                            control: (base) => ({
                              ...base,
                              minHeight: "36px",
                                height: "36px",
                              }),
                              valueContainer: (base) => ({
                                ...base,
                                padding: "0 8px",
                              }),
                              input: (base) => ({
                                ...base,
                                margin: "0",
                                padding: "0",
                              }),
                            }}
                          />
                        </div>
                        <div className="col-span-1">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleItemChange(index, "quantity", e.target.value)
                            }
                            min="1"
                            className="h-9 text-center p-1"
                          />
                        </div>
                        <div className="col-span-2 text-right">
                          {item.product ? (
                            <div className="text-sm">₹{item.product.price.toFixed(2)}</div>
                          ) : (
                            <div className="text-sm text-gray-400">-</div>
                          )}
                        </div>
                        <div className="col-span-2 text-right font-medium">
                          {item.product ? (
                            <div className="text-sm">
                              ₹{calculateItemTotal(item).toFixed(2)}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400">-</div>
                          )}
                        </div>
                        <div className="col-span-1 text-right">
                          {items.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(index)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>

                        {item.product && gstStatus === "withGst" && (
                          <div className="col-span-12 mt-1 pt-1 border-t border-gray-200 text-xs text-gray-500">
                            <div className="flex flex-wrap gap-x-4">
                              <span>GST Rate: {item.product.gstRate}%</span>
                              {billType === "local" ? (
                                <>
                                  <span>
                                    SGST ({item.product.gstRate / 2}%): ₹
                                    {calculateTaxes(item).sgst.toFixed(2)}
                                  </span>
                                  <span>
                                    CGST ({item.product.gstRate / 2}%): ₹
                                    {calculateTaxes(item).cgst.toFixed(2)}
                                  </span>
                                </>
                              ) : (
                                <span>
                                  IGST ({item.product.gstRate}%): ₹
                                  {calculateTaxes(item).igst.toFixed(2)}
                                </span>
                              )}
                              <span>
                                Tax: ₹
                                {(
                                  calculateTaxes(item).sgst +
                                  calculateTaxes(item).cgst +
                                  calculateTaxes(item).igst
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <Button variant="outline" size="sm" onClick={handleAddItem}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>

                  {items.some((item) => item.product) && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-2">Bill Items Summary</h3>
                      <div className="rounded-md border">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 text-xs font-medium text-gray-500">
                              <th className="px-3 py-2 text-left">Product</th>
                              <th className="px-3 py-2 text-center">Qty</th>
                              <th className="px-3 py-2 text-right">Unit Price</th>
                              <th className="px-3 py-2 text-right">Subtotal</th>
                              {gstStatus === "withGst" && (
                                <th className="px-3(py-2 text-right">Tax</th>
                              )}
                              <th className="px-3 py-2 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item, index) => {
                              if (!item.product) return null;
                              const baseAmount = item.product.price * item.quantity;
                              const taxes = calculateTaxes(item);
                              const totalTax = taxes.sgst + taxes.cgst + taxes.igst;

                              return (
                                <tr key={index} className="border-t border-gray-100">
                                  <td className="px-3 py-2 text-sm">{item.product.label}</td>
                                  <td className="px-3 py-2 text-sm text-center">
                                    {item.quantity}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-right">
                                    ₹{item.product.price.toFixed(2)}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-right">
                                    ₹{baseAmount.toFixed(2)}
                                  </td>
                                  {gstStatus === "withGst" && (
                                    <td className="px-3 py-2 text-sm text-right">
                                      ₹{totalTax.toFixed(2)}
                                    </td>
                                  )}
                                  <td className="px-3 py-2 text-sm text-right font-medium">
                                    ₹{calculateItemTotal(item).toFixed(2)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot>
                            <tr className="border-t border-gray-200 font-medium bg-gray-50">
                              <td
                                colSpan={gstStatus === "withGst" ? 3 : 2}
                                className="px-3 py-2 text-right"
                              >
                                Total:
                              </td>
                              <td className="px-3 py-2 text-right">
                                ₹{summary.subtotal.toFixed(2)}
                              </td>
                              {gstStatus === "withGst" && (
                                <td className="px-3 py-2 text-right">
                                  ₹{summary.totalTax.toFixed(2)}
                                </td>
                              )}
                              <td className="px-3 py-2 text-right">
                                ₹{summary.total.toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-4">
              <Card className="sticky top-4">
                <CardHeader className="pb-2">
                  <CardTitle>Bill Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>₹{summary.subtotal.toFixed(2)}</span>
                    </div>

                    {gstStatus === "withGst" && (
                      <>
                        <Separator className="my-2" />
                        {billType === "local" ? (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">SGST:</span>
                              <span>₹{summary.sgstTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">CGST:</span>
                              <span>₹{summary.cgstTotal.toFixed(2)}</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex justify-between">
                            <span className="text-gray-600">IGST:</span>
                            <span>₹{summary.igstTotal.toFixed(2)}</span>
                          </div>
                        )}
                      </>
                    )}

                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>₹{summary.total.toFixed(2)}</span>
                    </div>

                    <div className="pt-4 mt-4">
                      <Button
                        onClick={handleSubmit}
                        className="w-full"
                        size="lg"
                        disabled={loading}
                      >
                        Generate Bill
                      </Button>
                      <Button
                        variant="outline"
                        onClick={onCancel}
                        className="w-full mt-3"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateBillPage;