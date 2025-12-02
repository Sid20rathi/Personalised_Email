"use client";
import React, { useState } from "react";
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

const signup_schema = z.object({
  name: z.string().min(2,"full name must be at least 2 characters").max(50,"full name must be at most 50 characters").regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  email: z.string().email("email must be a valid email address").min(1,"email must be at least 1 character"),
  password: z.string().min(8,"password must be at least 8 characters").max(50,"password must be at most 50 characters").regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

})


type signupformData = z.infer<typeof signup_schema>







export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const router = useRouter()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const{ register, handleSubmit,formState:{errors},reset} = useForm<signupformData>({
  resolver: zodResolver(signup_schema),
  defaultValues: {
    name: "",
    email: "",
    password: "",
  },
})

const onSubmit = async(data:signupformData)=>{
  setIsLoading(true)
  try{
    const response = await axios.post(`${API_URL}/api/signup`,data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
   
    toast.success("Account created successfully!");

    if(response.data.access_token){
      localStorage.setItem("email_access_token",response.data.access_token)
    }
    reset()



  }catch(error:any){
    console.error("Signup error:", error.response?.data.detail );
    let message = error.response?.data?.detail || error.message;


  if (typeof message === "string" && message.includes(":")) {
    message = message.split(":").pop()?.trim();
  }

  toast.error(message || "Signup failed. Please try again.");

  }finally{
    setIsLoading(false)
  }
}




  return (
     
    <div className="grid grid-cols-2 w-full h-screen">
        <div className="bg-red-900">
            HYe

        </div>

        <div className="">
          <div className=" mx-auto  mt-32 w-full max-w-md rounded-none bg-white shadow-2xl p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to Email Agent
      </h2>
      <Toaster position="top-right" />
      
 
      <form className="my-8"  onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Siddhant Rathi" type="text" className={cn(
                    "w-full",
                    errors.name && "border-red-500 focus:ring-red-500"
                  )}{...register("name")}/>
                   {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.name.message}
                  </p>)}
            
          </LabelInputContainer>
          
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="myid@gmail.com" type="email" className={cn(
                    "w-full",
                    errors.email && "border-red-500 focus:ring-red-500"
                  )}
                  {...register("email")}/>
          {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.email.message}
                  </p>
                )}
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type={showPassword ? "text" : "password"}  className={cn(
                      "w-full pr-10",
                      errors.password && "border-red-500 focus:ring-red-500"
                    )}
                    {...register("password")} />
                     <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute mt-14 ml-80 pl-7 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <IconEyeClosed size={20} /> : <IconEye size={20} />}
                  </button>
        </LabelInputContainer>
        {errors.password ? (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.password.message}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                    Must be at least 8 characters with uppercase, lowercase, number, and special character
                  </p>
                )}
 
      <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "group/btn relative w-full h-12 mt-5 rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-lg transition-all duration-300",
                  "hover:from-neutral-800 hover:to-neutral-700",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "dark:from-zinc-900 dark:to-zinc-800 dark:hover:from-zinc-800 dark:hover:to-zinc-700"
                )}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mt-5 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <>
                    Sign up
                    <BottomGradient />
                  </>
                )}
              </button>
 
        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
 
       
      </form>
    </div>


        </div>

     
    </div>
  );
}


const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};
 
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