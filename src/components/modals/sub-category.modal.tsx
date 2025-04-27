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
import useCategoryStore from "@/store/useCategoryStore";
import { Loader2 } from "lucide-react";
import Select from "react-select";
import useSubCategory from "@/hooks/use-sub-category";
import { toast } from "sonner";

// Define interfaces
interface Category {
  _id: string;
  name: string;
}

interface SubCategory {
  _id: string;
  name: string;
  categoryId: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  handleCloseDialog: () => void;
}

// Define the component with typed props
const SubCategoryModal: React.FC<Props> = ({ handleCloseDialog }) => {
  const { categories, loading, initializeAuth, refetch } = useCategoryStore();
  const [selectedCategory, setSelectedCategory] = useState<SelectOption | null>(null);
  const [subcategoryInput, setSubcategoryInput] = useState<string>("");
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const { addSubCategory, fetchSubCategory } = useSubCategory();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Update subcategories array whenever the input changes, converting to lowercase
  useEffect(() => {
    const subcats = subcategoryInput
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter((item) => item);
    setSubcategories(subcats);
  }, [subcategoryInput]);

  const handleSubmit = async () => {
    if (!selectedCategory || subcategories.length === 0) {
      toast.error("Please select a parent category and enter at least one subcategory name.");
      return;
    }

    try {
      // Call addSubCategory for each subcategory
      for (const name of subcategories) {
        const payload: Partial<SubCategory> = {
          name,
          categoryId: selectedCategory.value,
        };
        const res = await addSubCategory(payload);
        if (res instanceof Error) {
          throw res; // Handle error for this subcategory
        }
      }
      toast.success("Subcategories saved successfully");
      handleCloseDialog();
      await fetchSubCategory(); // Refetch subcategories to update the list
      refetch(); // Refetch categories if needed
    } catch (error) {
      toast.error("Failed to save subcategories. One or more subcategories may already exist.");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const categoryOptions: SelectOption[] = categories?.map((item: Category) => ({
    value: item._id,
    label: item.name,
  })) || [];

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Subcategories</DialogTitle>
        <DialogDescription>
          Enter comma-separated subcategory names (e.g., Shirts,Trousers,Jackets). Names will be stored in lowercase.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="parentCategory">Parent Category</Label>
          <Select
            inputId="parentCategory"
            options={categoryOptions}
            value={selectedCategory}
            onChange={(option: SelectOption | null) => setSelectedCategory(option)}
            placeholder="Search or select parent category"
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
          <Label htmlFor="subcategoryName">Subcategory Names</Label>
          <Input
            id="subcategoryName"
            placeholder="Enter subcategories (e.g., Shirts,Trousers,Jackets)"
            value={subcategoryInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSubcategoryInput(e.target.value)
            }
          />
          {subcategories.length > 0 && (
            <div className="text-sm text-gray-500">
              Subcategories: {subcategories.join(", ")}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="outline" className="mr-2" onClick={handleCloseDialog}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedCategory || subcategories.length === 0}
        >
          Save Subcategories
        </Button>
      </div>
    </DialogContent>
  );
};

export default SubCategoryModal;