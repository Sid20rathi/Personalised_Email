"use client"
import React, { useState ,useEffect } from "react";
import { cn } from "@/lib/utils";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast"; 
import { useRouter } from "next/navigation"
import { isAuthenticated, setAuth } from "@/lib/auth";


const signinSchema = z.object({
    email: z.string().email("email must be a valid email address").min(1,"email must be at least 1 character"),
    password: z.string().min(8,"password must be at least 8 characters").max(50,"password must be at most 50 characters").regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
})

type signinformData = z.infer<typeof signinSchema>



export default function Signin(){
    const router = useRouter()
    const[loading,setLoading]=useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const Apiurl  = process.env.NEXT_PUBLIC_API_URL
    
    useEffect(()=>{
      if(isAuthenticated()){
        router.push("/dashboard")
      }
    },[router])



    const {register,handleSubmit ,formState:{errors},reset}= useForm<signinformData>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
          email: "",
          password: "",
        },
      })

      const visiblity = ()=>{
        setShowPassword(!showPassword)
      }
      const toSignup=()=>{
        router.push("/signup")
      }


      const Submit = async (data:signinformData)=>{
        setLoading(true)

        try{
            const response = await axios.post(`${Apiurl}/api/signin`,data,{
                headers: {
                    "Content-Type": "application/json",
                },
            })
            toast.success("Signed In successfully!");

            if(response.data.access_token){
                setAuth(response.data.access_token)
            }
       reset()
    router.push("/dashboard")

        }
        catch(error:any){
            console.error("Signin error:", error.response?.data.detail );
                let message = error.response?.data?.detail || error.message;
            
            
              if (typeof message === "string" && message.includes(":")) {
                message = message.split(":").pop()?.trim();
              }
            
              toast.error(message || "Signin failed. Please try again.");


        }
        finally{
            setLoading(false)
        }

    
      }




    return(
        <div className="grid lg:grid-cols-2 grid-cols-1 w-full h-screen selection:bg-red-600 ">
            <div className="bg-red-500">
                hye

            </div>
            <div className="flex flex-col items-center justify-center m-5">
                <div className="w-md  shadow-2xl p-5  rounded-md">
                    <div className="text-2xl font-semibold text-black mb-10 underline pl-28">
                        Login to application
                    </div>
                    <Toaster position="top-right" />
                  
                    <form onSubmit={handleSubmit(Submit)}>
                        <div>
                        <LabelInputContainer>
                        <Label className="text-md text-black mb-2 pl-3">Email</Label>
                        <Input className="w-full " type="email" placeholder="Enter your email" {...register("email")}/>
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </LabelInputContainer>

                    </div>
                    <div className="mt-5 relative">

                        <LabelInputContainer>
                        <Label className="text-md text-black  pl-3 ">Password</Label>
                        <Input className="w-full " type={showPassword ?"text":"password"} placeholder="Enter your password" {...register("password")}/>
                        <div className=""> 
                            <button
                                    type="button"
                                    onClick={visiblity}
                                    className="absolute pb-14 mb-2 ml-80 pl-9 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                    {showPassword ? <IconEyeClosed size={23} /> : <IconEye size={23} />}
                                    </button>


                        </div>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        
                        </LabelInputContainer>
                    </div>
                    <div className="mt-5">
                        <button className="w-full mb-3  bg-red-500 text-white font-bold py-2 rounded-md" type="submit">{loading?"Loading...":"Sign in"}</button>
                    </div>
                      <div>
                        <div className="text-sm flex items-center justify-center text-black">
                            Don't have an account? <span className="text-red-500 font-bold cursor-pointer hover:underline pl-2" onClick={toSignup}>Sign up</span>
                        </div>
                    </div>
                    </form>
                </div>
                

            </div>
        </div>
    )
    
}



const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};