

import { IAnalytics, IOverview } from "@/interfaces/IDashboard";
import apiClient from "@/utils/apiClient";
import { create } from "zustand";


interface Props{
    data:null | IOverview;
    analyticsData:null |IAnalytics;
    error:string;
    loading:boolean,
    initalize:()=>void;
    refetch:()=>void;
}

const useDashboardStore=create<Props>((set,get)=>({
    data:null,
    analyticsData:null,
    error:"",
    loading:false,
    initalize:()=>{
        const {data,analyticsData}=get();

        if(data && analyticsData){
            return;
        }

        const getData=async()=>{
            set({loading:true})
            try{
                const [res1,res2]=await Promise.all([apiClient.get("/dashboard"),apiClient.get("/dashboard/analytics")]);
                console.log("data",res1.data);
                console.log("data",res2.data);
                set({data:res1.data.data,analyticsData:res2.data.data})
            }catch(error){
                console.log(error);
                if(error instanceof Error)
                    set({error:error.message,data:null,analyticsData:null})
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
                const [res1,res2]=await Promise.all([apiClient.get("/dashboard"),apiClient.get("/dashboard/analytics")]);
                console.log("data",res1.data);
                console.log("data",res2.data);
                set({data:res1.data.data,analyticsData:res2.data.data})
            }catch(error){
                console.log(error);
                if(error instanceof Error)
                    set({error:error.message,data:null, analyticsData:null})
            }finally{
                set({loading:false})
            }
        }

        getData();
    }
}));

export default useDashboardStore;