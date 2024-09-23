import { createContext, useEffect, useState } from "react"

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState()

    useEffect(() => {
        const userToken = localStorage.getItem("user_token")
        if (userToken) {
            setUser(true)
            return
        }
    }, []);

    const signin = (data, result) => {

        if (result) {
            window.location.reload();
            localStorage.setItem("user_token", JSON.stringify( data ));
            setUser(true);
            return
        }
        
    };

    const signout = () => {
        setUser(null)
        localStorage.removeItem("user_token")
        return
    };

    return (
        <AuthContext.Provider
            value={{ user, signed: user, signin, signout }}>
            {children}
        </AuthContext.Provider>
    );
};