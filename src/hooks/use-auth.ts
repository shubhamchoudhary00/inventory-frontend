import apiClient from "@/utils/apiClient";


interface Payload{
    name:string;
    password:string;
}
const useAuthHook=()=>{
    
    const login=async(payload:Payload)=>{
        try{
            const res=await apiClient.post("/auth/login",payload);
            // console.log("res");
            return res.data;
        }catch(error){
            return error;
        }
    }

    return {login}
}

export default useAuthHook;
