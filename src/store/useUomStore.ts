import { IUom } from "@/interfaces/IUom";
import apiClient from "@/utils/apiClient";
import { create } from "zustand";


interface Props{
    uoms:null | IUom[],
    error:string;
    loading:boolean;
    setUom:(uom:IUom[]|null)=>void;
    initalize:()=>void;
    refetch:()=>void;

}

const useUomStore=create<Props>((set,get)=>({
    uoms:null,
    error:"",
    loading:false,
    setUom:(uom:IUom[] | null)=>{
        set({uoms:uom})
    },
    initalize:()=>{
        const {uoms}=get();
        if(uoms){
            return;
        }
        
        const getData=async()=>{
            set({loading:true})
            try{
                const res=await apiClient.get("/uom");
                // console.log(res.data.data);
                set({uoms:res.data.data});

            }catch(error){
                console.log(error);
                if(error instanceof Error)
                set({error:error.message,uoms:null})
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
                const res=await apiClient.get("/uom");
                // console.log(res.data.data);
                set({uoms:res.data.data});
            }catch(error){
                console.log(error);
                if(error instanceof Error)
                    set({error:error.message,uoms:null})
            }finally{
                set({loading:false})
            }
        }
        getData();
    }
}));

export default useUomStore;