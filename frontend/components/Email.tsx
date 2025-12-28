import { useEffect, useState } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { LoaderOne } from "./ui/loader";
import Email_layout from "./Email_layout";
import { useResumeStore } from "@/app/store/resumestore";



const urlschema = z.object({
  joburl: z.string().url({ message: "Please enter a valid URL" }).min(1, { message: "Job URL is required" }),
})

type urldata = z.infer<typeof urlschema>

type emailgenerated = "yes" | "no"




export default function EmailSection() {
  const [loading, setLoading] = useState<boolean>(false)
  const Apiurl = process.env.NEXT_PUBLIC_API_URL;
  const [email, setEmail] = useState<emailgenerated>('no')
  const [subject, setSubject] = useState<string | null>(null)
  const [body, setBody] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState<string | null>(null)
  const resumeUrlState = useResumeStore((state) => state.resumeUrl)

  useEffect(() => {
    const email_subject = localStorage.getItem("email_subject")
    const email_body = localStorage.getItem("email_body")
    const company_name = localStorage.getItem("company_name")
    if (email_subject && email_body) {
      setSubject(email_subject)
      setBody(email_body)
      setCompanyName(company_name)
      setEmail('yes')
    }
  }, [])


  const close = () => {
    setEmail('no')
    localStorage.removeItem("email_subject")
    localStorage.removeItem("email_body")
    localStorage.removeItem("company_name")
  
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<urldata>({
    resolver: zodResolver(urlschema),
    defaultValues: {
      joburl: "",
    },
  });
  const jobUrlValue = watch("joburl");

  const placeholders = [
    "Paste the job posting url",
    "Paste Linkedin Job Posting URL",
  ];
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("joburl", e.target.value, { shouldValidate: true });
  };
  const handlePlaceholderSubmit = (value: string) => {

    setValue("joburl", value, { shouldValidate: true });
    handleSubmit(onSubmit)();
  };

  

  const onSubmit = async (data: urldata) => {
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
      if (!resumeUrlState) {
        toast.error("Pls upload resume to generate the personilzed email.")
        return

      }
      const response = await axios.post(`${Apiurl}/api/generate/email`, {
        joburl: data.joburl
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
      )
      if (!response.data) {
        throw new Error("No email data found in response")
      }
      setSubject(response.data.email_subject)
      setBody(response.data.email_body)
      setCompanyName(response.data.company_name)
      setEmail('yes')
      localStorage.setItem("email_subject", response.data.email_subject)
      localStorage.setItem("email_body", response.data.email_body)
      localStorage.setItem("company_name", response.data.company_name)
      toast.success("Email generated successfully",{duration: 4000})

      reset()

    }
    catch (error) {

      toast.error("Error generating email")
    }
    finally {
      setLoading(false)
      reset()
    }
  }

  if (loading) {
    return <div className='text-center text-4xl font-serif mt-80 flex justify-center items-center flex-col pointer-events-auto'>
      <div className="flex flex-row"><span className='ml-5 pt-4 pr-4'>Generating your Email</span>  <LoaderOne /></div>
      <p className="text-sm text-neutral-500">(Please wait while we generate your email.Till that you can collect email id of recipient.)</p>


    </div>
  }



  return (
    <div className="w-full h-screen flex justify-center items-center flex-col pb-32">
      <div className=" flex justify-center items-center flex-col pointer-events-auto">
        <h2 className=" mt-6 text-4xl text-center text-black font-bold ">{email === 'no' ? " Generate Personalized Email " : "Email Generated"}</h2>
        <p className="pb-4 text-sm text-neutral-500">{email === 'no' ? "(Provide the url of the job positing for which you want to generate an email...)" : " "}</p>
      </div>
      <Toaster position="top-right" toastOptions={{duration: 4000}}/>
      {email === 'no' ? <div className=" w-full pointer-events-auto">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleInputChange}
          onSubmit={() => handleSubmit(onSubmit)()}
          
        />
        {errors.joburl && <p className="text-red-500 text-sm flex items-center justify-center mt-3">{errors.joburl.message}</p>}
      </div> :


        <div className="bg-white w-lvh h-full border-2 rounded-md mt-10 shadow-md pointer-events-auto">
          <Email_layout subject={subject} body={body} setclose={close} company={companyName}  /> </div>}
          
    </div>

  );
}