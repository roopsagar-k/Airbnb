import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) { 
    const [user, setUser] = useState(null)
    const [ready, setReady] = useState(true);

     useEffect(() => {
        if(!user) {                             
            axios.get('/profile')
            .then(response => {
                setUser(response.data);
                setReady(true);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }, []);
    return(
        <UserContext.Provider value={{user, setUser, ready}}>
            {children}
        </UserContext.Provider>
    );
}