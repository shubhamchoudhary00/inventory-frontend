

import { IAnalytics, IOverview } from "@/interfaces/IDashboard";
import apiClient from "@/utils/apiClient";
import { AxiosError } from "axios";
import { create } from "zustand";


interface Props{
    data:null | IOverview;
    analyticsData:null |IAnalytics;
    error:string;
    status:number;
    loading:boolean,
    initalize:()=>void;
    refetch:()=>void;
}

const useDashboardStore=create<Props>((set,get)=>({
    data:null,
    analyticsData:null,
    error:"",
    loading:false,
    status:0,
    initalize:()=>{
        const {data}=get();

        if(data ){
            return;
        }

        const getData=async()=>{
            set({loading:true})
            try{
                const [res1]=await Promise.all([apiClient.get("/dashboard")]);
                // console.log("data",res1.data);
                // console.log("data",res2.data);
                set({data:res1.data.data,analyticsData:null})
            }catch (error: unknown) {
                if (error instanceof AxiosError) {
                    if (error.response && error.response.status === 401) {
                        set({ status: error.response.status });
                    }
                    set({ error: error.message, data: null, analyticsData: null });
                } else {
                    // Handle other types of errors
                }
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
                const [res1]=await Promise.all([apiClient.get("/dashboard")]);
                // console.log("data",res1.data);
                // console.log("data",res2.data);
                set({data:res1.data.data,analyticsData:null})
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