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
import Select from "react-select";
import useUomStore from "@/store/useUomStore";
import { Loader2, X } from "lucide-react";
import useProducts from "@/hooks/use-product";
import useProductStore from "@/store/useProductStore";
import { toast } from "sonner";
import { IUom } from "@/interfaces/IUom";
import { IProduct } from "@/interfaces/IProduct";

// Define interfaces



interface SelectOption {
  value: string;
  label: string;
}

interface FormData {

  productName: string;
  unitOfMeasure: string;
  hsnSacCode: string;
  gstRate: string;
  stock: string;
}

interface Props {
  handleCloseDialog: () => void;
}

// Define the component with typed props
const ProductModal: React.FC<Props> = ({ handleCloseDialog }) => {
  const { uoms, loading: uomLoading, initalize } = useUomStore(); // Fixed typo: initalize -> initialize
  const { addProducts, loading: productLoading } = useProducts();
  const { refetch } = useProductStore();
  const [formData, setFormData] = useState<FormData>({
    
    productName: "",
    unitOfMeasure: "",
    hsnSacCode: "",
    gstRate: "",
    stock: "",
  });

  useEffect(() => {
     // Initialize category data
    initalize(); // Initialize UOM data
  }, [initalize]);

  const handleChange = (field: keyof FormData, value: SelectOption | string | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Reset subcategory when category changes
    }));
  };

  const handleSubmit = async () => {
    const { productName,  unitOfMeasure, hsnSacCode, gstRate, stock } = formData;
    if (!productName || !unitOfMeasure || !hsnSacCode || !gstRate || !stock) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const data: Partial<IProduct> = {
     
      productName,
      unitOfMeasure: unitOfMeasure,
      hsnSacCode,
      gstRate: parseFloat(gstRate),
      stock: parseInt(stock),
    };

    try {
      const res = await addProducts(data);
      if (res instanceof Error) {
        throw res;
      }
      toast.success("Product added successfully");
      refetch();
      reset();
      handleCloseDialog();
    } catch (error) {
      toast.error("Failed to add product. Please try again.");
      console.error(error);
    }
  };

  const reset=()=>{
    setFormData({
      productName:"",
      stock:"",
      hsnSacCode:"",
      gstRate:"",
      unitOfMeasure:""
    })
  }

  if ( uomLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }



  const unitOptions: SelectOption[] = uoms
    ?.filter((uom: IUom) => uom.isActive)
    .map((uom: IUom) => ({
      value: uom._id,
      label: `${uom.uom} (${uom.uom_short})`,
    })) || [];

  return (
    <DialogContent>
      <DialogHeader>
        <div className="absolute right-4 top-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-slate-100"
            onClick={handleCloseDialog}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogDescription>
          Fill in the details to add a new product to your inventory.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
     
        <div className="grid gap-2">
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            placeholder="Enter product name"
            value={formData.productName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("productName", e.target.value)
            }
          />
        </div>
       
        <div className="grid gap-2">
          <Label htmlFor="unitOfMeasure">Unit of Measure</Label>
          <Select
            inputId="unitOfMeasure"
            options={unitOptions}
            value={unitOptions.find((option) => option.value === formData.unitOfMeasure) || null}
            onChange={(value: SelectOption | null) => handleChange("unitOfMeasure", value?.value || "")}
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
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="hsnSacCode">HSN/SAC Code</Label>
          <Input
            id="hsnSacCode"
            placeholder="Enter HSN/SAC code"
            value={formData.hsnSacCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("hsnSacCode", e.target.value)
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="gstRate">GST Rate (%)</Label>
          <Input
            id="gstRate"
            type="number"
            placeholder="Enter GST rate"
            value={formData.gstRate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("gstRate", e.target.value)
            }
            min="0"
            step="0.01"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            placeholder="Enter stock quantity"
            value={formData.stock}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("stock", e.target.value)
            }
            min="0"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="outline" className="mr-2" onClick={handleCloseDialog}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            productLoading ||
           
            !formData.productName ||
            !formData.unitOfMeasure ||
            !formData.hsnSacCode ||
            !formData.gstRate ||
            !formData.stock
          }
        >
          {productLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Product"
          )}
        </Button>
      </div>
    </DialogContent>
  );
};

export default ProductModal;