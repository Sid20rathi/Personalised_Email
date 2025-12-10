"use client";


import { useRouter } from "next/navigation"
import React,{ useState ,useEffect, useCallback } from "react"
import { isAuthenticated } from '@/lib/auth';
import LogoutButton from "@/components/LogutoutButton";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { logout } from '@/lib/auth'
import EmailSection from "@/components/Email";
import ResumeSection from "@/components/Resume";
import DashboardHome from "@/components/Dashboard";
import axios from "axios";

type ActiveComponent = "home"|"email"|"resume"


export default function DashboardPage(){
    const router = useRouter()
    const[loading,setLoading]=useState(false)
    const Apiurl  = process.env.NEXT_PUBLIC_API_URL
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [activeComponent, setActiveComponent] = useState<ActiveComponent>('home');
    const [resumeUrl, setResumeUrl] = useState<string | null>(null)
    const[resumeLoading,setResumeLoading]=useState<boolean>(false)
  
  /*useEffect(()=>{
    const fetchResume = async()=>{
      try{
        setResumeLoading(true)
        const full_token = localStorage.getItem("email_access_token")
        if(!full_token){
          throw new Error("No access token found")
        }
        const token = JSON.parse(full_token).token
        if(!token){
          throw new Error("No token found in access token")
        }
        const response = await axios.get(`${Apiurl}/api/extraction/resume`,{
          headers:{
            "Authorization":`Bearer ${token}`
          }
        })

        if(!response.data){
          throw new Error("No resume data found in response")
        }
        console.log(response.data)
        setResumeUrl(response.data)
      }
      catch(error){
        console.error('Error fetching resume:', error)
      }
      finally{
        setResumeLoading(false)
      }
    }
    fetchResume();
  },[])*/

    useEffect(()=>{
      if(!isAuthenticated()){
        router.push("/signin")
      }
    },[])



    const links = [
    {
      label: "Email",
      href: "#",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Resume",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);

  const handleLinkClick = useCallback((label:string)=>{
    switch(label.toLowerCase()){
      case 'email':
        setActiveComponent('email')
        break;
      case 'resume':
        setActiveComponent('resume')
        break;
      case 'logout':
        logout()
        break;
      default:
        setActiveComponent('home')
        break;
    }

  },[])

   const renderActiveComponent = useCallback(() => {
    switch (activeComponent) {
      case 'email':
        return <EmailSection />;
      case 'resume':
        return <ResumeSection  />;
      case 'home':
      default:
        //return <DashboardHome />;
        return <EmailSection />;
    }
  }, [activeComponent]);


   const isLinkActive = useCallback((label: string): boolean => {
    return (
      (label === 'Home' && activeComponent === 'home') ||
      (label === 'Email' && activeComponent === 'email') ||
      (label === 'Resume' && activeComponent === 'resume')
    );
  }, [activeComponent]);







    return(
        <div className="w-full h-screen bg-neutral-100 ">
          

            <div
      className={cn(
        "h-screen flex w-full  flex-1 flex-col overflow-hidden rounded-md border border-neutral-200  md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "", 
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleLinkClick(link.label)}
                    className="cursor-pointer"
                  >
                    <SidebarLink 
                      link={link}
                      isActive={isLinkActive(link.label)}
                    />
                  </div>
                ))}
             
            </div>
          </div>
          <div>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1">
          <div className="flex h-screen w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
            {renderActiveComponent()}
          </div>
        </div>
    
    </div>
        </div>
    )
}

export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Acet Labs
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};
 
// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        
      </div>
    </div>
  );
};
