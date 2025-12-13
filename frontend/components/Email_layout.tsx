import { useState } from "react"
import { IconCopy,IconX} from "@tabler/icons-react";
import { toast, Toaster } from "react-hot-toast"; 
type emailgenerated ="yes"
type inputdata = {
    subject:string|null,
    body:string|null,
    setclose:()=>void,
    company:string|null
}
export default function Email_layout({subject,body,setclose,company}:inputdata ) {
    const [email,setEmail] = useState<emailgenerated | null>('yes')
    const [editableSubject, setEditableSubject] = useState(subject ?? "");
    const [editableBody, setEditableBody] = useState(body ?? "");

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
                <div>
                    <IconX className="w-6 h-6 cursor-pointer text-gray-400 hover:text-black" onClick={setclose} />
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
                    <IconCopy className="w-5 h-5 cursor-pointer text-gray-400 hover:text-black" onClick={()=>copyToClipboard(editableSubject)} />
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
                    <IconCopy className="w-5 h-5 cursor-pointer text-gray-400 hover:text-black " onClick={()=>copyToClipboard(editableBody)} />
                </div>

            </div>
            <div>

            </div>
            
        </div>
    </div>
  )
}