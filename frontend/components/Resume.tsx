import { useState, useEffect } from 'react'
import axios from 'axios';
import { LoaderOne } from './ui/loader';
import { FileUpload } from './ui/file-upload';
import { RippleButton } from './ui/ripple-button';
import { toast, Toaster } from "react-hot-toast";
import { useResumeStore } from "@/app/store/resumestore";


import PdfViewer from './PDFViewer';


export default function ResumeSection() {
  const Apiurl = process.env.NEXT_PUBLIC_API_URL
  const loading = useResumeStore((state) => state.loading)
  const resumeUrl = useResumeStore((state) => state.resumeUrl)
  const setLoading = useResumeStore((state) => state.setLoading)
  const setResumeUrl = useResumeStore((state) => state.setResumeUrl)

  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };





  /*useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true)
        const full_token = localStorage.getItem("email_access_token")
        if (!full_token) {
          throw new Error("No access token found")
        }
        const token = JSON.parse(full_token).token
        if (!token) {
          throw new Error("No token found in access token")
        }
        const response = await axios.get(`${Apiurl}/api/extraction/resume`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (!response.data) {
          throw new Error("No resume data found in response")
        }
        console.log(response.data)
        setResumeUrl(response.data)
      }
      catch (error) {
        console.error('Error fetching resume:', error)
      }
      finally {
        setLoading(false)
      }
    }
    fetchResume();
  }, [])*/









  const upload_resume = async () => {
    try {
      setLoading(true)
      
      if (files.length == 0) {
        toast.error("Please upload a file")
        return;
      }
      const stored = localStorage.getItem("email_access_token")
      if (!stored) {
        toast.error("No access token found")
        return;
      }
      const token = JSON.parse(stored).token
      if (!token) {
        toast.error("No token found in access token")
        return;
      }
      const formData = new FormData();
      formData.append("file", files[0])
      const response = await axios.post(`${Apiurl}/api/extraction/resume_upload`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      if (!response.data) {
        throw new Error("No resume data found in response")
      }
      const blobUrl = response.data?.blob_url;

      if (!blobUrl) {
        throw new Error("No blob URL returned");
      }
      setResumeUrl(blobUrl);
      toast.success("Resume uploaded successfully")
      setFiles([])

    }
    catch (error) {
     
      toast.error("Error uploading resume")
    }
    finally {
      setLoading(false)
      setFiles([])
    }
  }

  const getProxyUrl = (originalUrl: string) => {
    
    return `${Apiurl}/api/extraction/view-pdf?url=${encodeURIComponent(originalUrl)}`;
  };







  if (loading) {
    return <div className='text-center text-4xl font-serif mt-80 flex justify-center items-center pointer-events-auto'>
      <span className='ml-5 pt-4 pr-4'>Loading your Resume</span>  <LoaderOne />


    </div>
  }

  return (
    <div className="p-4 pb-20 mb-96 h-full z-50 pointer-events-auto" >
      <h2 className="text-4xl font-bold  flex items-center justify-center ">Your Resume</h2>
      <p className='text-center text-sm text-gray-500 mb-2'> (upload the resume for which you want to generate personalized email.)</p>
      <Toaster position="top-right" />

      {!resumeUrl ? <div className="w-full max-w-4x    bg-transparent dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg mt-28">
        <FileUpload onChange={handleFileUpload} />
        <div className='flex justify-center items-center mt-10'>
          <RippleButton rippleColor="#6008cf" onClick={upload_resume}>Upload file</RippleButton>

        </div>
      </div>
        :
        <div>

          <div className="mb-72 h-screen overflow-hidden">

            <PdfViewer url={getProxyUrl(resumeUrl)} />

            <div className="flex justify-center mt-4 mb-44">
              <RippleButton rippleColor="#6008cf" onClick={() => setResumeUrl(null)}>Upload Another Resume</RippleButton>
            </div>
          </div>




        </div>}

    </div>
  );
}