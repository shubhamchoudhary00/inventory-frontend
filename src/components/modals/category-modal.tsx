"use client"
import React, {  useState } from 'react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import useCategory from '@/hooks/use-category'
import { toast } from 'sonner'
import { Loader2, X } from 'lucide-react'
import useCategoryStore from '@/store/useCategoryStore'

const CategoryModal = ({handleCloseDialog}:{handleCloseDialog:()=>void}) => {
    const [name,setName]=useState("");
    const {loading,addCategory}=useCategory();
    const {refetch}=useCategoryStore();
    const handleSubmit = async () => {
      const res = await addCategory(name);
      if (res instanceof Error) {
        toast.error("Something went wrong");
      } else if (res.success) {
        toast.success("Category added");
        handleCloseDialog();
        refetch();
      }
    };
    if(loading){
        return (
            <div className='flex items-center justify-center h-full'>
                <Loader2 className='animate-spin' />
            </div>
        )
    }
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
      <DialogTitle>Add New Category</DialogTitle>
      <DialogDescription>
        Create a new product category.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="categoryName">Category Name</Label>
        <Input id="categoryName" placeholder="Enter category name" onChange={(e)=>setName(e.target.value)} />
      </div>
     
    </div>
    <div className="flex justify-end">
      <Button
        variant="outline"
        className="mr-2"
        onClick={handleCloseDialog}
      >
        Cancel
      </Button>
      <Button onClick={handleSubmit}>Save Category</Button>
    </div>
  </DialogContent>
  )
}

export default CategoryModal
