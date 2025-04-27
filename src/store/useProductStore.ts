import { IProduct } from "@/interfaces/IProduct";
import apiClient from "@/utils/apiClient";
import { create } from "zustand";


interface Props{
    products:null | IProduct[];
    error:string;
    loading:boolean,
    initalize:()=>void;
    refetch:()=>void;
}

const useProductStore=create<Props>((set,get)=>({
    products:null,
    error:"",
    loading:false,
    initalize:()=>{
        const {products}=get();

        if(products){
            return;
        }

        const getData=async()=>{
            set({loading:true})
            try{
                const res=await apiClient.get("/products");
                // console.log("products",res.data);
                set({products:res.data.data})
            }catch(error){
                console.log(error);
                if(error instanceof Error)
                    set({error:error.message,products:null})
            }finally{
                set({loading:false})
            }
        }

        getData();
    },
    refetch:()=>{
     

        const getData=async()=>{
            set({loading:true})
            try{
                const res=await apiClient.get("/products");
                // console.log("products",res.data);
                set({products:res.data.data})
            }catch(error){
                console.log(error);
                if(error instanceof Error)
                    set({error:error.message,products:null})
            }finally{
                set({loading:false})
            }
        }

        getData();
    }
}));

export default useProductStore;