import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userToken = localStorage.getItem("user_token");
        if (userToken) {
            setUser(JSON.parse(userToken));
        }
    }, []);

    const signin = (data, result) => {
        if (result) {
            localStorage.setItem("user_token", JSON.stringify(data));
            setUser(data);
            window.location.reload();
            return;
        }
    };

    const signout = () => {
        setUser(null);
        localStorage.removeItem("user_token");
    };

    return (
        <AuthContext.Provider value={{ user, signed: !!user, signin, signout }}>
            {children}
        </AuthContext.Provider>
    );
};