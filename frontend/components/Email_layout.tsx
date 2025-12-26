import { useEffect, useState } from "react"
import { IconCopy, IconX } from "@tabler/icons-react";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { useAuthStore } from "@/app/store/authstore";
import { useResumeStore } from "@/app/store/resumestore";


type emailgenerated = "yes"
type inputdata = {
  subject: string | null,
  body: string | null,
  setclose: () => void,
  company: string | null
  
}
export default function Email_layout({ subject, body, setclose, company, }: inputdata) {
  const [email, setEmail] = useState<emailgenerated | null>('yes')
  const [toEmails, setToEmails] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [editableSubject, setEditableSubject] = useState(subject ?? "");
  const [editableBody, setEditableBody] = useState(body ?? "");
  const [accessToken, setAccessToken] = useState('');
  const isAuthenticated = useAuthStore((state) => state.authenticated);
  const apiurl = process.env.NEXT_PUBLIC_API_URL
  const token = useAuthStore((state) => state.token);
  const resumeUrl = useResumeStore((state) => state.resumeUrl)
  const [isSending, setIsSending] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  const unauthenticate = useAuthStore((state) => state.unauthenticate);


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', 'Tab', ','].includes(e.key)) {
      e.preventDefault();
      const email = inputValue.trim();
      if (email) {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setToEmails([...toEmails, email]);
          setInputValue("");
        } else {
          toast.error("Invalid email address");
        }
      }
    } else if (e.key === 'Backspace' && !inputValue && toEmails.length > 0) {
      setToEmails(toEmails.slice(0, -1));
    }
  };

  const removeRecipient = (index: number) => {
    setToEmails(toEmails.filter((_, i) => i !== index));
  };

  const handleSendEmail = async () => {
    // Validation
    if (!isAuthenticated) {
      toast.error('Please authenticate with Google first');
      return;
    }

    // Combine current input if valid
    let currentEmails = [...toEmails];
    if (inputValue.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue.trim())) {
      currentEmails.push(inputValue.trim());
      setInputValue("");
      setToEmails(currentEmails);
    }

    const validEmails = currentEmails.filter(email =>
      email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    );

    if (validEmails.length === 0) {
      toast.error('Please add at least one valid recipient email');
      return;
    }

    if (!editableSubject.trim()) {
      toast.error('Subject is required');
      return;
    }

    if (!editableBody.trim()) {
      toast.error('Email body is required');
      return;
    }

    setIsSending(true);
    const toastId = toast.loading('Sending emails...');

    try {

      const sendPromises = validEmails.map(async (recipientEmail) => {
        const emailData = {
          to: recipientEmail.trim(),
          subject: editableSubject.trim(),
          body: editableBody.trim(),
          attachment_url: resumeUrl.trim() || null
        };

        return axios.post(`${API_BASE_URL}/api/generate/send-email`, emailData, {
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
          }
        });
      });


      const results = await Promise.allSettled(sendPromises);


      const successful = results.filter(r => r.status === 'fulfilled' && r.value.data.success);
      const failed = results.filter(r => r.status === 'rejected' || !r.value?.data?.success);

      if (failed.length === 0) {
        toast.success(`Successfully sent ${successful.length} email(s)!`, { id: toastId });
        setclose()

      


      } else if (successful.length > 0) {
        toast.success(`Sent ${successful.length} email(s), ${failed.length} failed`, { id: toastId });
        setclose()
      } else {
        toast.error(`Failed to send all ${failed.length} email(s)`, { id: toastId });
      }


      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Failed to send to ${validEmails[index]}:`, result.reason);
        }
      });

    } catch (error: any) {
      console.error('Error sending emails:', error);
      toast.error('Failed to send emails. Please try again.', { id: toastId });

      // Check if it's an authentication error
      if (error.response?.status === 401) {
        toast.error('Authentication expired. Please reconnect your Google account.');
        unauthenticate();
        
      }
    } finally {
      setIsSending(false);
    }
  };


  const verify = async () => {
    try {
      const response = await axios.get(`${apiurl}/auth/google`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }

      })
      window.location.href = response.data.auth_url;


    } catch (error) {
      toast.error('Failed to start authentication');
      console.error(error);
    }
  }



  const copyToClipboard = async (text: string | null) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard ✅");
    } catch (err) {
      toast.error("Copy failed ❌");
    }
  };

  return (
    <div className="w-full h-full flex justify-center selection:bg-black selection:text-white">
      <div className="w-svw   ">
        <Toaster position="top-right" />
        <div className=" bg-blue-100  shadow-2xs p-3 text-2xl font-bold border-b-2 rounded flex justify-between ">
          <div>
            Email for {company}
          </div>
          <div className="flex justify-between">
            <div>
              <div className="flex justify-end pr-5 pt-1 ">
          {isAuthenticated ? <div className={`w-30 h-7 bg-blue-500 text-white text-sm text-center font-mono cursor-pointer hover:bg-green-500 transition-colors duration-300 flex items-center justify-center rounded-4xl  shadow-2xl hover:shadow-md`} onClick={handleSendEmail} >Send</div>
            :
            <div className={`w-50 h-7 bg-green-500 text-sm text-white text-center font-mono cursor-pointer hover:bg-green-500 transition-colors duration-300 flex items-center justify-center rounded-4xl p-3 shadow-2xl hover:shadow-md`} onClick={verify} >Connect Gmail</div>}


        </div>


            </div>

            <div className="pt-2">
            <IconX className="w-6 h-6 cursor-pointer text-gray-400 hover:text-black" onClick={setclose} />
          </div>
          
          </div>
          

        </div>

        <div className="p-2 font-sans shadow-md flex flex-row items-center border-b border-gray-100">
          <div className="px-2 text-gray-600 font-medium">
            To
          </div>
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {toEmails.map((email, index) => (
              <div key={index} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm group hover:bg-gray-200 transition-colors">
                <span>{email}</span>
                <IconX
                  className="w-3 h-3 cursor-pointer text-gray-400 group-hover:text-gray-600"
                  onClick={() => removeRecipient(index)}
                />
              </div>
            ))}
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="outline-none flex-1 min-w-[200px] h-8 bg-transparent"
              placeholder={toEmails.length === 0 ? "Recipients" : ""}
            />
          </div>
        </div>

        <div className=" p-3 font-sans shadow-md flex justify-between">
          <div className="w-full">
            <input
              value={editableSubject}
              onChange={(e) => setEditableSubject(e.target.value)}
              className="w-full outline-none border-none bg-transparent font-medium "
              placeholder="Email subject"
            />
          </div>
          <div>
            <IconCopy className="w-5 h-5 cursor-pointer text-gray-400 hover:text-black" onClick={() => copyToClipboard(editableSubject)} />
          </div>

        </div>
        <div className=" h-[500px] p-3 inset-shadow-md flex justify-between whitespace-pre-line ">
          <div className=" w-full h-[500px] ">
            <textarea
              value={editableBody}
              onChange={(e) => setEditableBody(e.target.value)}
              className="w-full resize-none outline-none bg-transparent whitespace-pre-line overflow-y-scroll hide-scrollbar h-[470px] leading-relaxed overflow-auto pb-6"
              placeholder="your email here..."
            />

          </div>

          <div className="">
            <IconCopy className="w-5 h-5 cursor-pointer text-gray-400 hover:text-black " onClick={() => copyToClipboard(editableBody)} />
          </div>

        </div>
        



      </div>
    </div>
  )
}