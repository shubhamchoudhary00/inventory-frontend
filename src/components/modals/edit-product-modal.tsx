"use client";
import React, { useEffect, useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Select, { SingleValue } from "react-select";
import useCategoryStore from "@/store/useCategoryStore";
import useUomStore from "@/store/useUomStore";
import { Loader2 } from "lucide-react";
import useProducts from "@/hooks/use-product";
import useProductStore from "@/store/useProductStore";
import { IProduct } from "@/interfaces/IProduct";

import { IUom } from "@/interfaces/IUom";



interface EditProductModalProps {
  setOpenDialog: (value: string) => void;
  productId: string | null;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ setOpenDialog, productId }) => {
  const { categories, subCategories, loading: categoryLoading, initializeAuth } = useCategoryStore();
  const { uoms, loading: uomLoading, initalize } = useUomStore();
  const { updateProduct, loading } = useProducts();
  const { products,refetch } = useProductStore();
  const [product, setProduct] = useState<IProduct | undefined>(undefined);
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    unitOfMeasure: "",
    hsnSacCode: "",
    gstRate: "",
    stock: "",
  });

  useEffect(() => {
    if (!productId) return;
    if(products){
      const foundProduct =products.find((t:IProduct) => t._id === productId);
      setProduct(foundProduct);
    }

  }, [productId, products]);

  // Initialize form with product data
  useEffect(() => {
    if (product && categories && subCategories && uoms) {
      setFormData({
      
        productName: product.productName || "",
        price: product.price?.toString() || "",
        unitOfMeasure: typeof product.unitOfMeasure === 'object' ? product.unitOfMeasure?._id || "" : product.unitOfMeasure || "",
        hsnSacCode: product.hsnSacCode || "",
        gstRate: product.gstRate?.toString() || "",
        stock: product.stock?.toString() || "",
      });
    }
  }, [product, categories, subCategories, uoms]);

  // Initialize category and UOM data
  useEffect(() => {
    initializeAuth();
    initalize();
  }, [initializeAuth, initalize]);

  const handleChange = (field: string, value: { value: string; label: string; } | SingleValue<{ value: string; label: string; }> | string ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCloseDialog = () => {
    setOpenDialog("");
  };

  const handleSubmit = async () => {
    const { productName, price, unitOfMeasure, hsnSacCode, gstRate, stock } = formData;

    if ( !productName || !price || !unitOfMeasure || !hsnSacCode || !gstRate || !stock) {
      alert("Please fill in all required fields.");
      return;
    }

    const parsedPrice = parseFloat(price);
    const parsedGstRate = parseFloat(gstRate);
    const parsedStock = parseInt(stock);

    if (parsedPrice <= 0 || parsedGstRate < 0 || parsedStock < 0) {
      alert("Price must be positive, GST rate must be non-negative, and stock must be non-negative.");
      return;
    }

    const data:Partial<IProduct> = {
 
      productName,
      price: parsedPrice,
      unitOfMeasure,
      hsnSacCode,
      gstRate: parsedGstRate,
      stock: parsedStock,
    };

    try {
      await updateProduct(data, product?._id ?? "");
      handleCloseDialog();
      refetch()
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  if (categoryLoading || uomLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }



  const unitOptions = uoms
    ?.filter((uom:IUom) => uom.isActive)
    .map((uom:IUom) => ({
      value: uom._id,
      label: `${uom.uom} (${uom.uom_short})`,
    })) || [];

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit IProduct</DialogTitle>
        <DialogDescription>
          Update the details of the product in your inventory.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
 
        <div className="grid gap-2">
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            placeholder="Enter product name"
            value={formData.productName}
            onChange={(e) => handleChange("productName", e.target.value)}
            aria-label="IProduct name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="productPrice">Price (without tax)</Label>
          <Input
            id="productPrice"
            type="number"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            min="0"
            step="0.01"
            aria-label="IProduct price"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="unitOfMeasure">Unit of Measure</Label>
          <Select
            inputId="unitOfMeasure"
            options={unitOptions}
            value={unitOptions.find((option: {value:string; label:string;}) => option.value === formData.unitOfMeasure) || null}
            onChange={(value) => handleChange("unitOfMeasure", value?.value || "")}
            placeholder="Select unit of measure"
            isClearable
            isSearchable
            classNamePrefix="react-select"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#e2e8f0",
                padding: "2px",
                "&:hover": { borderColor: "#cbd5e1" },
              }),
              menu: (base) => ({
                ...base,
                zIndex: 9999,
              }),
            }}
            aria-label="Select unit of measure"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="hsnSacCode">HSN/SAC Code</Label>
          <Input
            id="hsnSacCode"
            placeholder="Enter HSN/SAC code"
            value={formData.hsnSacCode}
            onChange={(e) => handleChange("hsnSacCode", e.target.value)}
            aria-label="HSN/SAC code"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="gstRate">GST Rate (%)</Label>
          <Input
            id="gstRate"
            type="number"
            placeholder="Enter GST rate"
            value={formData.gstRate}
            onChange={(e) => handleChange("gstRate", e.target.value)}
            min="0"
            step="0.01"
            aria-label="GST rate"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            placeholder="Enter stock quantity"
            value={formData.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            min="0"
            aria-label="Stock quantity"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="outline" className="mr-2" onClick={handleCloseDialog} aria-label="Cancel">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            loading ||
            !formData.productName ||
            !formData.price ||
            !formData.unitOfMeasure ||
            !formData.hsnSacCode ||
            !formData.gstRate ||
            !formData.stock
          }
          aria-label="Update product"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Update Product"}
        </Button>
      </div>
    </DialogContent>
  );
};

export default EditProductModal;