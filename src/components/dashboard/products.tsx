import React, { useEffect, useState } from "react";
import { TabsContent } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, Search } from "lucide-react";
import useProductStore from "@/store/useProductStore";
import useStore from "@/store/useStore";
// import useProducts from "@/hooks/use-product";
import { Dialog, DialogTrigger } from "../ui/dialog";
import EditProductModal from "../modals/edit-product-modal";
import { Input } from "../ui/input"; // Assuming Input component exists in your UI library

interface Product {
  _id: string;
  productName: string;
  category?: { name: string };
  price: number;
  gstRate: number;
  hsnSacCode: string;
  stock: number;
}

const Products = ({ handleOpenDialog }: { handleOpenDialog: (data: string) => void }) => {
  const { products, loading, initalize } = useProductStore() as {
    products: Product[];
    loading: boolean;
    initalize: () => void;
  };
  const { openDialog, setOpenDialog, setProductId, productId } = useStore();
  // const { deleteProduct } = useProducts();
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search input
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // State for filtered products

  useEffect(() => {
    if (products) return;
    initalize();
  }, [products, initalize]);

  // Update filtered products whenever products or searchQuery changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredProducts(products);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = products.filter((product: Product) =>
      product.productName.toLowerCase().includes(lowerCaseQuery) ||
      (product.category?.name?.toLowerCase()?.includes(lowerCaseQuery) ?? false)
    );
    setFilteredProducts(filtered);
  }, [products, searchQuery]);

  const handleEditDialog = (data: string, id?: string) => {
    setOpenDialog(data);
    if (id) {
      setProductId(id);
    }
  };

  // const handleDelete = async (id: string) => {
  //   if (confirm("The data will be deleted permanently. Are you sure?")) {
  //     await deleteProduct(id);
  //   }
  // };

  if (loading) {
    return (
      <TabsContent value="products">
        <Card>
          <CardContent>Loading products...</CardContent>
        </Card>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="products">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Products</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search by product name or category"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-[250px]"
              />
            </div>
            <Button onClick={() => handleOpenDialog("addProduct")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Products table">
              <thead>
                <tr className="border-b text-gray-500">
                  <th scope="col" className="px-4 py-3 text-left">
                    ID
                  </th>
                  <th scope="col" className="px-4 py-3 text-left">
                    Product Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-left">
                    Category
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    Price
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    GST Rate
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    HSN/SAC
                  </th>
                  <th scope="col" className="px-4 py-3 text-center">
                    Stock
                  </th>
                  <th scope="col" className="px-4 py-3 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts && filteredProducts.length > 0 ? (
                  filteredProducts.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{item._id.slice(6)}</td>
                      <td className="px-4 py-3 font-medium">{item.productName}</td>
                      <td className="px-4 py-3">{item.category?.name?.toUpperCase() || "N/A"}</td>
                      <td className="px-4 py-3 text-right">
                        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.price)}
                      </td>
                      <td className="px-4 py-3 text-right">{item.gstRate}%</td>
                      <td className="px-4 py-3 text-right">{item.hsnSacCode}</td>
                      <td className="px-4 py-3 text-center">{item.stock}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center space-x-2">
                          <Dialog open={openDialog === "editProduct" && productId === item._id}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEditDialog("editProduct", item?._id)}
                                aria-label="Edit product"
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
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                              </Button>
                            </DialogTrigger>
                            <EditProductModal setOpenDialog={setOpenDialog} productId={item._id} />
                          </Dialog>
                          {/* <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(item._id)}
                            aria-label="Delete product"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </Button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-3 text-center text-gray-500">
                      No products found
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

export default Products;