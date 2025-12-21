import { useEffect, useState } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { LoaderOne } from "./ui/loader";
import Email_layout from "./Email_layout";



const urlschema = z.object({
  joburl: z.string().url({ message: "Please enter a valid URL" }).min(1, { message: "Job URL is required" }),
})

type urldata = z.infer<typeof urlschema>

type emailgenerated = "yes" | "no"




export default function EmailSection() {
  const [jobUrl, setJoburl] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const Apiurl = process.env.NEXT_PUBLIC_API_URL;
  const [email, setEmail] = useState<emailgenerated>('no')
  const [subject, setSubject] = useState<string | null>(null)
  const [body, setBody] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState<string | null>(null)
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)


  const close = () => {
    setEmail('no')
    setSubject(null)
    setBody(null)
    setJoburl(null)
    setCompanyName(null)
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

  useEffect(() => {
    const fetchResume = async () => {
      try {

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

        setResumeUrl(response.data)
      }
      catch (error) {
        console.error('Error fetching resume:', error)
      }
      finally {

      }
    }
    fetchResume();
  }, [])



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
      if (!resumeUrl) {
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
      console.log(response.data)
      setSubject(response.data.email_subject)
      setBody(response.data.email_body)
      setCompanyName(response.data.company_name)
      setEmail('yes')
      toast.success("Email generated successfully")

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
      <p className="text-sm text-neutral-500">(Please wait while we generate your email. This usually takes a few seconds.)</p>


    </div>
  }



  return (
    <div className="w-full h-screen flex justify-center items-center flex-col pb-32">
      <div className=" flex justify-center items-center flex-col pointer-events-auto">
        <h2 className="text-4xl text-center text-black font-bold ">{email === 'no' ? " Generate Personalized Email " : "Email Generated"}</h2>
        <p className="text-sm text-neutral-500">{email === 'no' ? "(Provide the url of the job positing for which you want to generate an email...)" : " "}</p>
      </div>
      <Toaster position="top-right" />
      {email === 'yes' ? <div className="mt-7 w-full pointer-events-auto">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleInputChange}
          onSubmit={() => handleSubmit(onSubmit)()}
        />
        {errors.joburl && <p className="text-red-500 text-sm flex items-center justify-center mt-3">{errors.joburl.message}</p>}
      </div> :


        <div className="bg-white w-lvh h-full border-2 rounded-md mt-10 shadow-md pointer-events-auto">
          <Email_layout subject={subject} body={body} setclose={close} company={companyName} /> </div>}
          
    </div>

  );
}