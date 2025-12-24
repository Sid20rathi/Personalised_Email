import {create} from 'zustand'
import axios from 'axios'

const Apiurl = process.env.NEXT_PUBLIC_API_URL

export const useAuthStore= create((set)=>({
    loading:false,
    setLoading:(loading)=>set({loading:loading}),
    authenticated:false,
    token:null,
    setAuthenticated: async()=>{
        set({loading:true})
        try{
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
      set({token:token})
    
             const response = await axios.get(`${Apiurl}/auth/authenticate`,{
              headers: {
                        "Authorization": `Bearer ${token}`
        }
            
        })
        set({authenticated:response.data.authenticated,loading:false})


        }
        catch(error){
            console.error('Error fetching resume:', error)
            set({ loading: false })
        }
    }

}))  