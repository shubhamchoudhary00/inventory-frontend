// "use client"
// import apiClient from "@/utils/apiClient";
// import { useState } from "react"
// import { toast } from "sonner";

// const useGst=()=>{
//     const [data,setData]=useState();
//     const [loading,setLoading]=useState<boolean>(false);
//     const [error,setError]=useState<string>("");

//     const fetchGst=async()=>{
//         setLoading(true)
//         try{
//             const res=await apiClient.get("/gst");
//             console.log("gst",res);
//             setData(res.data);
//             return res.data;
//         }catch(error:unknown){
//             toast.error("Something went wrong");
//             console.log(error)
//             if(error instanceof Error)
//             setError(error.message)
//         }finally{
//             setLoading(false)
//         }
//     }


//     const addGst=async(payload:GSTData)=>{
//         setLoading(true)
//         try{
//             const res=await apiClient.post("/gst",payload);
//             console.log(res.data);
//             return res.data;

//         }catch(error){
//             toast.error("Something went wrong");
//             console.log(error)
//             if(error instanceof Error)
//             setError(error.message)
//         }finally{
//             setLoading(false)
//         }
//     }

//     return {data,error,loading,addGst,fetchGst};
// }

// export default useGst;