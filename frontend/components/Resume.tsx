import {useState,useEffect} from 'react'
import axios from 'axios';
import { LoaderOne } from './ui/loader';
import { FileUpload } from './ui/file-upload';
import { RippleButton } from './ui/ripple-button';
import { toast, Toaster } from "react-hot-toast"; 
type ResumeData = {
  resume_url: string | null,
  loading: boolean
}

export default function ResumeSection({resume_url,loading}:ResumeData){
  const Apiurl = process.env.NEXT_PUBLIC_API_URL
  const[upload_loading,setUploadLoading] = useState<boolean>(loading)
  const[resumeUrl,setResumeUrl] = useState<string|null>(resume_url)

  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);  
  };

  const status = ()=>{
    if(loading==true){
      
    }
  }









  const upload_resume = async ()=>{
    try{
      setUploadLoading(true)
      if(files.length==0){
        toast.error("Please upload a file")
        return;
      }
      const stored = localStorage.getItem("email_access_token")
      if(!stored){
        toast.error("No access token found")
        return;
      }
      const token = JSON.parse(stored).token
      if(!token){
        toast.error("No token found in access token")
        return;
      }
      const formData = new FormData();
      formData.append("file",files[0])
      const response = await axios.post(`${Apiurl}/api/extraction/resume_upload`,formData,{
        headers:{
          "Authorization":`Bearer ${token}`
        }
      })
      if(!response.data){
        throw new Error("No resume data found in response")
      }
      toast.success("Resume uploaded successfully")
      setFiles([])
      
    }
    catch(error){
      console.log(error)
    }
    finally{
      setUploadLoading(false)
      setFiles([])  
    }
  }







  if (upload_loading) {
    return <div className='text-center text-4xl font-serif mt-80 flex justify-center items-center'> 
    <span className='ml-5 pt-4 pr-4'>Loading your Resume</span>  <LoaderOne />
    
    
    </div>
  }

  return (
    <div className="p-4">
      <h2 className="text-4xl font-bold mb-4 flex items-center justify-center ">Your Resume</h2>
      <Toaster position="top-right" />
      
      {resumeUrl ? <div className="w-full max-w-4x    bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg mt-40">
      <FileUpload onChange={handleFileUpload} />
      <div className='flex justify-center items-center mt-10'>
        <RippleButton rippleColor="#6008cf" onClick={upload_resume}>Upload file</RippleButton>

      </div>
    </div>
    :
    
    <div>Upload your resume</div>}
      
    </div>
  );
}