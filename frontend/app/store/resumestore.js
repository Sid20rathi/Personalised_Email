import {create} from 'zustand'
import axios from 'axios'

const Apiurl = process.env.NEXT_PUBLIC_API_URL
export const useResumeStore = create((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading: loading }),
  resumeUrl: null,
  setResumeUrl: (url) => set({ resumeUrl: url }),
  fetchResumeUrl: async() => {
    set({ loading: true })
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
        
        set({ resumeUrl: response.data , loading: false })
      }
      catch (error) {
        console.error('Error fetching resume:', error)
        set({ loading: false })
      }

  }
}))