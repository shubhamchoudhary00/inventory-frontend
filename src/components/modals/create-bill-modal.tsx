// "use client"
// import React, { useState, useEffect } from 'react';
// import { Label } from '../ui/label';
// import { Input } from '../ui/input';
// import { Button } from '../ui/button';
// import { PlusCircle, Trash2, ChevronLeft } from 'lucide-react';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// import { Card, CardHeader, CardTitle,  CardContent } from '../ui/card';
// import { Separator } from '../ui/separator';
// import ReactSelect from 'react-select';
// import useProductStore from '@/store/useProductStore';

// const CreateBillPage = ({ onCancel }:{onCancel:()=>void}) => {
//   const { products, loading, error, refetch } = useProductStore();
//   const [billType, setBillType] = useState('local');
//   const [gstStatus, setGstStatus] = useState('withGst');
//   const [items, setItems] = useState([
//     { product: null, quantity: 1 },
//   ]);
//   const [customerData, setCustomerData] = useState({
//     name: '',
//     contact: '',
//     paymentMethod: '',
//     billDate: new Date().toISOString().split('T')[0],
//   });

//   useEffect(() => {
//     refetch();
//   }, [refetch]);

//   const handleAddItem = () => {
//     setItems([...items, { product: null, quantity: 1 }]);
//   };

//   const handleRemoveItem = (index) => {
//     if (items.length > 1) {
//       const updatedItems = [...items];
//       updatedItems.splice(index, 1);
//       setItems(updatedItems);
//     }
//   };

//   const handleItemChange = (index, field, value) => {
//     const updatedItems = [...items];
//     if (field === 'product') {
//       updatedItems[index] = { ...updatedItems[index], product: value };
//     } else if (field === 'quantity') {
//       updatedItems[index] = { ...updatedItems[index], quantity: parseInt(value) || 1 };
//     }
//     setItems(updatedItems);
//   };

//   const handleCustomerChange = (field, value) => {
//     setCustomerData((prev) => ({ ...prev, [field]: value }));
//   };

//   const calculateItemTotal = (item) => {
//     if (!item.product) return 0;
//     const baseAmount = item.product.price * item.quantity;
//     if (gstStatus === 'withoutGst') return baseAmount;
    
//     const gstAmount = (baseAmount * item.product.gstRate) / 100;
//     return baseAmount + gstAmount;
//   };

//   const calculateTaxes = (item) => {
//     if (!item.product || gstStatus === 'withoutGst') return { sgst: 0, cgst: 0, igst: 0 };
    
//     const baseAmount = item.product.price * item.quantity;
//     const gstAmount = (baseAmount * item.product.gstRate) / 100;
    
//     if (billType === 'local') {
//       return {
//         sgst: gstAmount / 2,
//         cgst: gstAmount / 2,
//         igst: 0,
//       };
//     }
//     return {
//       sgst: 0,
//       cgst: 0,
//       igst: gstAmount,
//     };
//   };

//   const calculateBillSummary = () => {
//     let subtotal = 0;
//     let sgstTotal = 0;
//     let cgstTotal = 0;
//     let igstTotal = 0;
    
//     items.forEach((item) => {
//       if (!item.product) return;
//       const baseAmount = item.product.price * item.quantity;
//       subtotal += baseAmount;
      
//       if (gstStatus === 'withGst') {
//         const taxes = calculateTaxes(item);
//         sgstTotal += taxes.sgst;
//         cgstTotal += taxes.cgst;
//         igstTotal += taxes.igst;
//       }
//     });

//     const totalTax = sgstTotal + cgstTotal + igstTotal;
//     return { 
//       subtotal, 
//       sgstTotal, 
//       cgstTotal, 
//       igstTotal,
//       totalTax, 
//       total: subtotal + totalTax 
//     };
//   };

//   const productOptions = products?.map((product) => ({
//     value: product._id,
//     label: product.productName,
//     price: product.price,
//     gstRate: product.gstRate,
//   })) || [];

//   const summary = calculateBillSummary();

//   const handleSubmit = () => {
//     if (!customerData.name || !customerData.contact || !customerData.paymentMethod || 
//         items.some(item => !item.product)) {
//       alert('Please fill all required fields');
//       return;
//     }
    
//     console.log({
//       customer: customerData,
//       items,
//       billType,
//       gstStatus,
//       summary,
//     });
//     // Navigate back or handle success
//   };

//   return (
//     <div className="container mx-auto py-8 px-4">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
//         <div className="mb-4 sm:mb-0">
//           <h1 className="text-2xl font-bold">Create New Bill</h1>
//           <p className="text-gray-500 mt-1">Generate a new bill for customer purchase</p>
//         </div>
//         <div className="flex gap-3">
//           <Button variant="outline" onClick={onCancel} className="flex items-center">
//             <ChevronLeft className="h-4 w-4 mr-1" />
//             Back
//           </Button>
//           <Button onClick={handleSubmit} disabled={loading}>
//             Generate Bill
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left side - Customer Details and Bill Settings */}
//         <div className="lg:col-span-1 space-y-6">
//           {/* Customer Details */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle>Customer Details</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="customerName">Customer Name</Label>
//                   <Input
//                     id="customerName"
//                     placeholder="Enter customer name"
//                     value={customerData.name}
//                     onChange={(e) => handleCustomerChange('name', e.target.value)}
//                     className="mt-1"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="customerContact">Contact Number</Label>
//                   <Input
//                     id="customerContact"
//                     placeholder="Enter contact number"
//                     value={customerData.contact}
//                     onChange={(e) => handleCustomerChange('contact', e.target.value)}
//                     className="mt-1"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="paymentMethod">Payment Method</Label>
//                   <Select
//                     onValueChange={(value) => handleCustomerChange('paymentMethod', value)}
//                     value={customerData.paymentMethod}
//                   >
//                     <SelectTrigger id="paymentMethod" className="mt-1">
//                       <SelectValue placeholder="Select payment method" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="cash">Cash</SelectItem>
//                       <SelectItem value="card">Card</SelectItem>
//                       <SelectItem value="upi">UPI</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label htmlFor="billDate">Bill Date</Label>
//                   <Input
//                     id="billDate"
//                     type="date"
//                     value={customerData.billDate}
//                     onChange={(e) => handleCustomerChange('billDate', e.target.value)}
//                     className="mt-1"
//                   />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Bill Settings */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle>Bill Settings</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-5">
//                 <div>
//                   <Label className="block mb-2">Bill Type</Label>
//                   <div className="flex gap-3">
//                     <Button
//                       variant={billType === 'local' ? 'default' : 'outline'}
//                       onClick={() => setBillType('local')}
//                       size="sm"
//                       className="flex-1"
//                     >
//                       Local
//                     </Button>
//                     <Button
//                       variant={billType === 'interstate' ? 'default' : 'outline'}
//                       onClick={() => setBillType('interstate')}
//                       size="sm"
//                       className="flex-1"
//                     >
//                       Interstate
//                     </Button>
//                   </div>
//                 </div>
                
//                 <div>
//                   <Label className="block mb-2">GST Treatment</Label>
//                   <div className="flex gap-3">
//                     <Button
//                       variant={gstStatus === 'withGst' ? 'default' : 'outline'}
//                       onClick={() => setGstStatus('withGst')}
//                       size="sm"
//                       className="flex-1"
//                     >
//                       With GST
//                     </Button>
//                     <Button
//                       variant={gstStatus === 'withoutGst' ? 'default' : 'outline'}
//                       onClick={() => setGstStatus('withoutGst')}
//                       size="sm"
//                       className="flex-1"
//                     >
//                       Without GST
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Bill Summary */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle>Bill Summary</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Subtotal:</span>
//                   <span>₹{summary.subtotal.toFixed(2)}</span>
//                 </div>
                
//                 {gstStatus === 'withGst' && (
//                   <>
//                     <Separator className="my-2" />
//                     {billType === 'local' ? (
//                       <>
//                         <div className="flex justify-between text-sm">
//                           <span className="text-gray-600">SGST:</span>
//                           <span>₹{summary.sgstTotal.toFixed(2)}</span>
//                         </div>
//                         <div className="flex justify-between text-sm">
//                           <span className="text-gray-600">CGST:</span>
//                           <span>₹{summary.cgstTotal.toFixed(2)}</span>
//                         </div>
//                       </>
//                     ) : (
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-600">IGST:</span>
//                         <span>₹{summary.igstTotal.toFixed(2)}</span>
//                       </div>
//                     )}
//                   </>
//                 )}
                
//                 <Separator className="my-2" />
//                 <div className="flex justify-between font-semibold text-lg">
//                   <span>Total:</span>
//                   <span>₹{summary.total.toFixed(2)}</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
        
//         {/* Right side - Products and Items */}
//         <div className="lg:col-span-2">
//           <Card>
//             <CardHeader className="pb-3 flex flex-row items-center justify-between">
//               <CardTitle>Products & Items</CardTitle>
//               <Button variant="outline" size="sm" onClick={handleAddItem}>
//                 <PlusCircle className="mr-2 h-4 w-4" />
//                 Add Item
//               </Button>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-6">
//                 {items.map((item, index) => (
//                   <div 
//                     key={index} 
//                     className="p-4 rounded-md border border-gray-200 bg-gray-50"
//                   >
//                     <div className="flex justify-between items-center mb-3">
//                       <h4 className="text-sm font-medium">Item #{index + 1}</h4>
//                       {items.length > 1 && (
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => handleRemoveItem(index)}
//                           className="h-8 w-8 p-0"
//                         >
//                           <Trash2 className="h-4 w-4 text-red-500" />
//                         </Button>
//                       )}
//                     </div>
                    
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
//                       <div className="md:col-span-2">
//                         <Label className="text-xs mb-1 block">Product</Label>
//                         <ReactSelect
//                           options={productOptions}
//                           value={item.product}
//                           onChange={(value) => handleItemChange(index, 'product', value)}
//                           placeholder="Search or select product"
//                           isClearable
//                           isSearchable
//                           classNamePrefix="react-select"
//                           styles={{
//                             control: (base) => ({
//                               ...base,
//                               borderColor: '#e2e8f0',
//                               '&:hover': { borderColor: '#cbd5e1' },
//                             }),
//                             menu: (base) => ({
//                               ...base,
//                               zIndex: 9999,
//                             }),
//                           }}
//                         />
//                       </div>
//                       <div>
//                         <Label className="text-xs mb-1 block">Quantity</Label>
//                         <Input
//                           type="number"
//                           value={item.quantity}
//                           onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
//                           min="1"
//                           className="h-9"
//                         />
//                       </div>
//                     </div>
                    
//                     {item.product && (
//                       <>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
//                           <div>
//                             <span className="block text-gray-500 text-xs">Unit Price</span>
//                             <span className="font-medium">₹{item.product.price.toFixed(2)}</span>
//                           </div>
//                           <div>
//                             <span className="block text-gray-500 text-xs">Subtotal</span>
//                             <span className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</span>
//                           </div>
                          
//                           {gstStatus === 'withGst' && (
//                             <>
//                               <div>
//                                 <span className="block text-gray-500 text-xs">GST Rate</span>
//                                 <span className="font-medium">{item.product.gstRate}%</span>
//                               </div>
//                               <div>
//                                 <span className="block text-gray-500 text-xs">Total</span>
//                                 <span className="font-medium">₹{calculateItemTotal(item).toFixed(2)}</span>
//                               </div>
//                             </>
//                           )}
                          
//                           {gstStatus === 'withoutGst' && (
//                             <div className="md:col-span-2">
//                               <span className="block text-gray-500 text-xs">Total</span>
//                               <span className="font-medium">₹{calculateItemTotal(item).toFixed(2)}</span>
//                             </div>
//                           )}
//                         </div>
                        
//                         {gstStatus === 'withGst' && (
//                           <div className="mt-3 pt-3 border-t border-gray-200">
//                             <div className="flex justify-between items-center mb-1">
//                               <span className="text-xs text-gray-500">Tax Details</span>
//                               <span className="text-xs text-gray-500">
//                                 Tax Amount: ₹{(calculateTaxes(item).sgst + calculateTaxes(item).cgst + calculateTaxes(item).igst).toFixed(2)}
//                               </span>
//                             </div>
                            
//                             {billType === 'local' ? (
//                               <div className="grid grid-cols-2 gap-2 text-xs">
//                                 <div>
//                                   <span className="text-gray-500">SGST ({item.product.gstRate / 2}%): </span>
//                                   <span className="font-medium">₹{calculateTaxes(item).sgst.toFixed(2)}</span>
//                                 </div>
//                                 <div>
//                                   <span className="text-gray-500">CGST ({item.product.gstRate / 2}%): </span>
//                                   <span className="font-medium">₹{calculateTaxes(item).cgst.toFixed(2)}</span>
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="text-xs">
//                                 <span className="text-gray-500">IGST ({item.product.gstRate}%): </span>
//                                 <span className="font-medium">₹{calculateTaxes(item).igst.toFixed(2)}</span>
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
          
//           {/* Product Summary Table */}
//           {items.some(item => item.product) && (
//             <Card className="mt-6">
//               <CardHeader className="pb-3">
//                 <CardTitle>Bill Items Summary</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="rounded-md border">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="bg-gray-50 text-xs font-medium text-gray-500">
//                         <th className="px-4 py-3 text-left">Product</th>
//                         <th className="px-4 py-3 text-center">Qty</th>
//                         <th className="px-4 py-3 text-right">Unit Price</th>
//                         <th className="px-4 py-3 text-right">Subtotal</th>
//                         {gstStatus === 'withGst' && (
//                           <th className="px-4 py-3 text-right">Tax</th>
//                         )}
//                         <th className="px-4 py-3 text-right">Total</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {items.map((item, index) => {
//                         if (!item.product) return null;
//                         const baseAmount = item.product.price * item.quantity;
//                         const taxes = calculateTaxes(item);
//                         const totalTax = taxes.sgst + taxes.cgst + taxes.igst;
                        
//                         return (
//                           <tr key={index} className="border-t border-gray-100">
//                             <td className="px-4 py-3 text-sm">{item.product.label}</td>
//                             <td className="px-4 py-3 text-sm text-center">{item.quantity}</td>
//                             <td className="px-4 py-3 text-sm text-right">₹{item.product.price.toFixed(2)}</td>
//                             <td className="px-4 py-3 text-sm text-right">₹{baseAmount.toFixed(2)}</td>
//                             {gstStatus === 'withGst' && (
//                               <td className="px-4 py-3 text-sm text-right">₹{totalTax.toFixed(2)}</td>
//                             )}
//                             <td className="px-4 py-3 text-sm text-right font-medium">₹{calculateItemTotal(item).toFixed(2)}</td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                     <tfoot>
//                       <tr className="border-t border-gray-200 font-medium bg-gray-50">
//                         <td colSpan={gstStatus === 'withGst' ? 3 : 2} className="px-4 py-3 text-right">
//                           Total:
//                         </td>
//                         <td className="px-4 py-3 text-right">₹{summary.subtotal.toFixed(2)}</td>
//                         {gstStatus === 'withGst' && (
//                           <td className="px-4 py-3 text-right">₹{summary.totalTax.toFixed(2)}</td>
//                         )}
//                         <td className="px-4 py-3 text-right">₹{summary.total.toFixed(2)}</td>
//                       </tr>
//                     </tfoot>
//                   </table>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>
      
//       {/* Bottom Action Bar */}
//       <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between">
//         <div className="text-xl font-bold mb-4 sm:mb-0">
//           Total Amount: ₹{summary.total.toFixed(2)}
//         </div>
//         <div className="flex gap-3">
//           <Button variant="outline" onClick={onCancel}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={loading}>
//             Generate Bill
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateBillPage;