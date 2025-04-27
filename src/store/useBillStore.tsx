import { IBiill } from "@/interfaces/IBill";
import apiClient from "@/utils/apiClient";
import { create } from "zustand";


interface Props{
    bills:null | IBiill[];
    error:string;
    loading:boolean,
    initalize:()=>void;
    refetch:()=>void;
}

const useBillStore=create<Props>((set,get)=>({
    bills:null,
    error:"",
    loading:false,
    initalize:()=>{
        const {bills}=get();

        if(bills){
            return;
        }

        const getData=async()=>{
            set({loading:true})
            try{
                const res=await apiClient.get("/bills");
                console.log("bills",res.data);
                set({bills:res.data.data})
            }catch(error){
                console.log(error);
                if(error instanceof Error)
                    set({error:error.message,bills:null})
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
                const res=await apiClient.get("/bills");
                console.log("products",res.data);
                set({bills:res.data.data})
            }catch(error){
                console.log(error);
                if(error instanceof Error)
                    set({error:error.message,bills:null})
            }finally{
                set({loading:false})
            }
        }

        getData();
    }
}));

export default useBillStore;