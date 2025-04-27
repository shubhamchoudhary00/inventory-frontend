import { create } from "zustand";

interface Props{
    sidebarOpen:boolean;
    openDialog:string;
    activeTab:string;
    productId:string | null;
    setSidebarOpen:(data:boolean)=>void;
    setActiveTab:(data:string)=>void;
    setProductId:(data:string |null)=>void;
    setOpenDialog:(data:string)=>void;
}

const useStore=create<Props>((set)=>({
    sidebarOpen:true,
    openDialog:"",
    productId:null,
    activeTab:"overview",
  
    setSidebarOpen:(data:boolean)=>{
        set({sidebarOpen:data})
    },
    setOpenDialog:(data:string)=>{
        set({openDialog:data})
    },
    setProductId:(data:string | null)=>{
        set({productId:data})
    },
    setActiveTab:(data:string)=>{
        set({activeTab:data})
    },
}));

export default useStore;