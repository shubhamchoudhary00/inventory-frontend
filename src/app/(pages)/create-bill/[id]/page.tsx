"use client";
import React, { useEffect, useState} from 'react';
import { ChevronLeft, Printer } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import useBillStore from '@/store/useBillStore';
import { useRouter } from 'next/navigation';
import useBill from '@/hooks/use-bill';
import { toast } from 'sonner';
import { IBiill } from '@/interfaces/IBill';

interface Props{
  params:Promise<{id:string}>
}

const BillDetailsPage = ({ params }:Props) => {
  const { id } = React.use(params);
  const router = useRouter();
  const { bills, initalize } = useBillStore();
  const [billData, setBillData] = useState<IBiill |undefined | null>(null);
  const {getBill,loading}=useBill();

  // Initialize bills if not available
  useEffect(() => {
    if (!bills) {
      initalize();
    }
  }, [bills, initalize]);

  // Find the current bill
  useEffect(() => {
    if (bills) {
      const bill = bills.find((t:IBiill) => t._id === id);
      setBillData(bill);
    }
  }, [bills, id]);

  // Print functionality

  const onBack = () => {
    router.push('/dashboard');
  };


  const handlePrint=async(id:string)=>{
    if(loading) return;
    try{
        const res=await getBill(id);
        if(res && res.success){
            toast.success("Downloaded successfully");
            return
        }
        toast.error("Something went wrong")
    }catch(error){
        console.log(error);
        toast.error("Something went wrong")
    }
  }
  // Loading state
  if (!billData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-xl font-medium">Loading bill details...</div>
          <p className="text-gray-500 mt-2">Please wait while we fetch the bill information</p>
        </div>
      </div>
    );
  }

  const { customer, items, billType, gstStatus, summary, invoiceNo, createdAt } = billData;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 lg:ml-64">
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold">Bill Details</h1>
              <p className="text-gray-500 mt-1">Invoice No: {invoiceNo}</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center"
                onClick={()=>handlePrint(id)}
              >
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onBack} 
                className="flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>
          </div>

          <div  className="space-y-6">
            <Card className="mb-6 shadow-sm">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="font-semibold text-lg mb-3">Customer Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <label className="text-sm font-medium text-gray-600">Customer Name</label>
                        <p className="mt-1 font-medium">{customer.name}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <label className="text-sm font-medium text-gray-600">Contact Number</label>
                        <p className="mt-1 font-medium">{customer.contact}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <label className="text-sm font-medium text-gray-600">Payment Method</label>
                        <p className="mt-1 font-medium capitalize">{customer.paymentMethod}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <label className="text-sm font-medium text-gray-600">Bill Date</label>
                        <p className="mt-1 font-medium">
                          {new Date(customer.billDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                    <h3 className="font-semibold text-lg mb-3">Bill Information</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <label className="text-sm font-medium text-gray-600">Bill Type</label>
                        <p className="mt-1 font-medium capitalize">{billType}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <label className="text-sm font-medium text-gray-600">GST Status</label>
                        <p className="mt-1 font-medium capitalize">{gstStatus === 'withGst' ? 'With GST' : 'Without GST'}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <label className="text-sm font-medium text-gray-600">Created At</label>
                        <p className="mt-1 font-medium">
                        {createdAt ? new Date(createdAt).toLocaleString() : 'Not available'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle>Bill Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 text-xs font-medium text-gray-500">
                            <th className="px-4 py-3 text-left">Product</th>
                            <th className="px-4 py-3 text-center">Qty</th>
                            <th className="px-4 py-3 text-right">Unit Price</th>
                            <th className="px-4 py-3 text-right">Subtotal</th>
                            {gstStatus === 'withGst' && (
                              <th className="px-4 py-3 text-right">Tax</th>
                            )}
                            <th className="px-4 py-3 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          { items && items.map((item, index) => {
                            const baseAmount = item.product && item.product.price * item.quantity;
                            const taxAmount =
                              gstStatus === 'withGst'
                                ? ((baseAmount ?? 0) * (item?.product?.gstRate ?? 0)) / 100
                                : 0;
                            const totalAmount = (baseAmount ?? 0 ) + taxAmount;

                            return (
                              <tr key={index} className={`border-t border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                <td className="px-4 py-3">{item.product && item.product.label}</td>
                                <td className="px-4 py-3 text-center">{item.quantity}</td>
                                <td className="px-4 py-3 text-right">₹{ item.product && item.product.price.toFixed(2)}</td>
                                <td className="px-4 py-3 text-right">₹{(baseAmount ?? 0).toFixed(2)}</td>
                                {gstStatus === 'withGst' && (
                                  <td className="px-4 py-3 text-right">₹{taxAmount.toFixed(2)}</td>
                                )}
                                <td className="px-4 py-3 text-right font-medium">₹{totalAmount.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="border-t border-gray-200 font-medium bg-gray-100">
                            <td colSpan={gstStatus === 'withGst' ? 3 : 2} className="px-4 py-3 text-right">
                              Total:
                            </td>
                            <td className="px-4 py-3 text-right">₹{summary.subtotal.toFixed(2)}</td>
                            {gstStatus === 'withGst' && (
                              <td className="px-4 py-3 text-right">₹{summary.totalTax.toFixed(2)}</td>
                            )}
                            <td className="px-4 py-3 text-right">₹{summary.total.toFixed(2)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {gstStatus === 'withGst' && (
                      <div className="mt-6 bg-gray-50 p-4 rounded-md text-sm">
                        <h4 className="font-medium mb-3">Tax Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {items.map((item, index) => (
                            <div key={index} className="p-3 border border-gray-200 rounded-md bg-white">
                              <p className="font-medium">{item.product && item.product.label}</p>
                              <p className="text-gray-600 text-xs mt-1">HSN/SAC: { item.product && item.product.hsnSacCode}</p>
                              <p className="text-gray-600 text-xs">GST Rate: { item.product && item.product.gstRate}%</p>
                              <div className="mt-2 pt-2 border-t border-gray-100">
                                {billType === 'local' ? (
                                  <>
                                    <div className="flex justify-between text-xs">
                                      <span>SGST ({item.product && item.product.gstRate / 2}%):</span>
                                      <span>₹{(summary.sgstTotal / items.length).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs mt-1">
                                      <span>CGST ({item.product && item.product.gstRate / 2}%):</span>
                                      <span>₹{(summary.cgstTotal / items.length).toFixed(2)}</span>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex justify-between text-xs">
                                    <span>IGST ({ item.product && item.product.gstRate}%):</span>
                                    <span>₹{(summary.igstTotal / items.length).toFixed(2)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-4">
                <Card className="sticky top-4 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle>Bill Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-lg">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>₹{summary.subtotal.toFixed(2)}</span>
                      </div>

                      {gstStatus === 'withGst' && (
                        <>
                          <Separator className="my-3" />
                          {billType === 'local' ? (
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
                          <Separator className="my-3" />
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Tax:</span>
                            <span>₹{summary.totalTax.toFixed(2)}</span>
                          </div>
                        </>
                      )}

                      <Separator className="my-3" />
                      <div className="flex justify-between font-semibold text-xl bg-gray-50 p-3 rounded-md">
                        <span>Total:</span>
                        <span>₹{summary.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BillDetailsPage;