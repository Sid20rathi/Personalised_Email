const token_KEY ="email_access_token"

export const setAuth=(token:string):void=>{
    if (typeof window == "undefined") return;

    const expirydate = new Date()
    expirydate.setDate(expirydate.getDate() +1)

    const tokendata ={
        token,
        expirydate:expirydate.getTime(),
        setAt:Date.now()


    }


    localStorage.setItem(token_KEY,JSON.stringify(tokendata))

}

export const getAuthToken =():string|null =>{
    if (typeof window == "undefined") return null;

    const tokenDataStr= localStorage.getItem(token_KEY)
    if (!tokenDataStr) return null;

    try {
        const tokenData = JSON.parse(tokenDataStr);
        const now = Date.now();
    
        if (now > tokenData.expiry) {
            localStorage.removeItem(token_KEY);
            return null;
        }
    
        return tokenData.token;
      } catch {
        localStorage.removeItem(token_KEY);
        return null;
      }
    };

export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

export const clearAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(token_KEY);
};

export const logout = (): void => {
  clearAuthToken();
  window.location.href = '/signin';
};


