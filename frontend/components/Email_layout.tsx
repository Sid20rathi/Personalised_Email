export default function Email_layout() {
  return (
    <div className="w-full h-full flex justify-center selection:bg-black selection:text-white">
        <div className="w-svw   ">
            <div className=" bg-blue-100  shadow-2xs p-3 text-2xl font-bold border-b-2 rounded "> 
                New Email 
            </div>
            <div className=" p-3 font-sans shadow-md">
                Subject:

            </div>
            <div className=" h-[500px] p-4 inset-shadow-md">
                body :

            </div>
            <div>

            </div>
            
        </div>
    </div>
  )
}