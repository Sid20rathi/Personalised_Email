"use client";


import { useRouter } from "next/navigation"
import { useState ,useEffect } from "react"
import { isAuthenticated } from '@/lib/auth';
import LogoutButton from "@/components/LogutoutButton";


export default function Dashboard(){
    const router = useRouter()
    const[loading,setLoading]=useState(false)
    const Apiurl  = process.env.NEXT_PUBLIC_API_URL
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(()=>{
      if(!isAuthenticated()){
        router.push("/signin")
      }
    })






    return(
        <div className="w-full h-screen selection:bg-red-600">
            <h1 className="text-3xl font-bold text-center text-black">Dashboard</h1>

            <LogoutButton />
        </div>
    )
}