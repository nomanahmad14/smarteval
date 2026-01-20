import { createContext,useContext,useEffect,useState } from "react";
import axios from 'axios';

const AuthContext=createContext();
const BACKEND_URL=import.meta.env.VITE_BACKEND_URL;

export const AuthProvider=({children}) => {
    const [user,setUser] = useState(null);
    const[token,setToken]=useState(null);
    const [role,setRole]=useState(null);
    const [loading,setLoading]=useState(null);

    //logout function used for everyone

    const logout=()=>{
        setUser(null);
        setToken(null);
        setRole(null);

        localStorage.clear();
    }

    //axios instance
    const authAxios=axios.create({
        baseURL:BACKEND_URL,
    });

    authAxios.interceptors.request.use((config)=>{
        if(token){
            config.headers.Authorization=`Bearer ${token}`
        }

        return config
    });

    authAxios.interceptors.response.use(
        (response)=>response,
        (error)=>{
            if(
                error.response?.status === 401 ||
                error.response?.status === 403
            ){
                logout();
            }

            return Promise.reject(error);
        }
    );

}