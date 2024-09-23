import React, { createContext, useState, useEffect } from 'react';
import Api from '../Api';

// Cria o contexto
export const InfoUserContext = createContext();

// Cria o provedor do contexto
export const InfoUserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const storedToken = localStorage.getItem("user_token");
    const token = storedToken ? JSON.parse(storedToken).token : null;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Api.post(`perfil`, JSON.stringify({ 'token': token }), {
                    headers: { 'Content-Type': 'application/json' }
                });
                setUserInfo(response.data);
            } catch (error) {
                setError(error);
                console.log(error);
            }
        };

        token && fetchData();
    }, [token]);
    
    return (
        <InfoUserContext.Provider value={{ userInfo, setUserInfo, error }}>
            {children}
        </InfoUserContext.Provider>
    );
};