"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { BarChart3, Folder, FolderPlus, Home, LogOut, Package, Percent, Plus, Receipt} from 'lucide-react'
import { Dialog,  DialogTrigger } from '../ui/dialog'
import SubCategoryModal from '../modals/sub-category.modal'
import CategoryModal from '../modals/category-modal'
import ProductModal from '../modals/product.modal'
import useStore from '@/store/useStore'
import { useRouter } from 'next/navigation'
import UOMModal from '../modals/gst-modal'



const Sidebar = () => {
  // Add state for GST Modal
  const [isGSTModalOpen, setIsGSTModalOpen] = useState(false);
  const router=useRouter();

  const {sidebarOpen,openDialog,activeTab,setActiveTab,setOpenDialog}=useStore();
  const handleOpenDialog = (dialogName: string) => {
    setOpenDialog(dialogName);
  };

  const handleCloseDialog = () => {
    setOpenDialog("");
  };

  // Handler for GST data when saved


  return (
    <aside
    className={`fixed left-0 top-0 z-40 h-screen w-64 bg-white shadow-sm transition-transform ${
      sidebarOpen ? "translate-x-0" : "-translate-x-full"
    } lg:translate-x-0`}
  >
    <div className="flex h-16 items-center border-b px-6">
      <div className="flex items-center space-x-2">
        <div className="h-6 w-6">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6 text-indigo-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2L2 7L12 12L22 7L12 2Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2 17L12 22L22 17"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2 12L12 17L22 12"
            />
          </svg>
        </div>
        <span className="text-lg font-semibold">SaaS Admin</span>
      </div>
    </div>
    <nav className="flex flex-col gap-1 p-4">
      <Button
        variant={activeTab === "overview" ? "secondary" : "ghost"}
        className="justify-start"
        onClick={() => setActiveTab("overview")}
      >
        <Home className="mr-2 h-4 w-4" />
        Overview
      </Button>
      <Button
        variant={activeTab === "analytics" ? "secondary" : "ghost"}
        className="justify-start"
        onClick={() => setActiveTab("analytics")}
      >
        <BarChart3 className="mr-2 h-4 w-4" />
        Analytics
      </Button>
      <Button
        variant={activeTab === "products" ? "secondary" : "ghost"}
        className="justify-start"
        onClick={() => setActiveTab("products")}
      >
        <Package className="mr-2 h-4 w-4" />
        Products
      </Button>
      <Button
        variant={activeTab === "transactions" ? "secondary" : "ghost"}
        className="justify-start"
        onClick={() => setActiveTab("transactions")}
      >
        <Receipt className="mr-2 h-4 w-4" />
        Transactions
      </Button>
      {/* <Button
        variant={activeTab === "customers" ? "secondary" : "ghost"}
        className="justify-start"
        onClick={() => setActiveTab("customers")}
      >
        <Users className="mr-2 h-4 w-4" />
        Customers
      </Button>
      <Button
        variant={activeTab === "settings" ? "secondary" : "ghost"}
        className="justify-start"
        onClick={() => setActiveTab("settings")}
      >
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </Button> */}

      <div className="mt-4 border-t pt-4">
        <div className="px-3 text-xs font-semibold uppercase text-gray-500">
          Actions
        </div>
        <Dialog open={openDialog === "addProduct"}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="mt-2 w-full justify-start"
              onClick={() => handleOpenDialog("addProduct")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <ProductModal handleCloseDialog={handleCloseDialog} />
        </Dialog>

        <Dialog open={openDialog === "addCategory"}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleOpenDialog("addCategory")}
            >
              <Folder className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <CategoryModal handleCloseDialog={handleCloseDialog} />
        </Dialog>

        <Dialog open={openDialog === "addSubcategory"}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleOpenDialog("addSubcategory")}
            >
              <FolderPlus className="mr-2 h-4 w-4" />
              Add Subcategory
            </Button>
          </DialogTrigger>
        <SubCategoryModal handleCloseDialog={handleCloseDialog} />
        </Dialog>

        {/* GST Button - Now opens the new GSTModal component */}
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setIsGSTModalOpen(true)}
        >
          <Percent className="mr-2 h-4 w-4" />
          Add New Unit
        </Button>
        
        {/* Import and use the new GSTModal component */}
        <UOMModal
          isOpen={isGSTModalOpen} 
          onClose={() => setIsGSTModalOpen(false)}
        />

        <Dialog open={openDialog === "createBill"}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/create-bill")}
            >
              <Receipt className="mr-2 h-4 w-4" />
              Create Bill
            </Button>
          </DialogTrigger>
          {/* <CreateBillModal handleCloseDialog={handleCloseDialog} /> */}
        </Dialog>
      </div>

      <div className="mt-auto pt-4">
        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </nav>
  </aside>
  )
}

export default Sidebar