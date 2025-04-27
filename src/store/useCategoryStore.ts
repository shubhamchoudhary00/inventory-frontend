
import { ICategory } from "@/interfaces/ICategory";
import { ISubCategory } from "@/interfaces/ISubCategory";
import apiClient from "@/utils/apiClient";
import {create} from "zustand"

interface Props{
    categories:ICategory[] | null;
    loading:boolean;
    subCategories:ISubCategory[] | null;
    error:string;
    setSubCategories:(data:ISubCategory[] | null)=>void;
    setCategories:(data:ICategory[] | null)=>void;
    initializeAuth:()=>void;
    refetch:()=>void;
}

const useCategoryStore=create<Props>((set,get)=>({
    categories:null,
    subCategories:null,
    loading:false,
    error:"",
    setCategories:(data:ICategory[] |null)=>{
        set({categories:data});
    },
    setSubCategories:(data:ISubCategory[] | null)=>{
        set({subCategories:data});
    },
    initializeAuth:()=>{
        const {categories,subCategories}=get();
        if(categories || subCategories){
            return ;
        }
        const  getData=async()=>{
            set({loading:true})
            try{
                const [res1,res2]=await Promise.all([apiClient.get("/category"),apiClient.get("/sub-category")]);
                // console.log("res",res1.data.data)
                if(res1.data.data){
                    set({categories:res1.data.data})
                }
                if(res2.data.data){
                    set({subCategories:res2.data.data})
                }
            }catch(error){
                set({categories:null,subCategories:null})
                if(error instanceof Error){
                    set({error:error.message})
                }
            }finally{
                set({loading:false})

            }
        }
        getData();
        

    },
    refetch:()=>{
        
        const  getData=async()=>{
            set({loading:true})

            try{
                const [res1,res2]=await Promise.all([apiClient.get("/category"),apiClient.get("/sub-category")]);
                // console.log("res",res1.data.data)
                if(res1.data.data){
                    set({categories:res1.data.data})
                }
                if(res2.data.data){
                    set({subCategories:res2.data.data})
                }
            }catch(error){
                set({categories:null,subCategories:null})
                if(error instanceof Error){
                    set({error:error.message})
                }
            }finally{
                set({loading:false})

            }
        }
        getData();


    }

}));

export default useCategoryStore;