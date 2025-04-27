import { IUser } from '@/interfaces/IUser'
import {create} from 'zustand'


interface Props{
    user:IUser | null;
    setUser:(data:IUser | null)=>void;

}
const userStore=create<Props>((set)=>({
    user:null,
    setUser:(data:IUser | null)=>{
        set({user:data})
    },
    
}));

export default userStore;