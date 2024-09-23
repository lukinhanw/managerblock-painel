import React, { createContext, useState, useEffect, useCallback } from 'react';
import Api from '../Api';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [temNotificacao, setTemNotificacao] = useState(false);
    const userToken = localStorage.getItem("user_token");
    const { idUsuario } = userToken ? JSON.parse(userToken) : {};

    const verificarNotificacoes = useCallback(async () => {
        try {
            const response = await Api.get(`verificar-codigo-pendente/${idUsuario}`);
            setTemNotificacao(response.data.codigo_pendente);
        } catch (error) {
            console.error('Erro ao verificar notificações:', error);
        }
    }, [idUsuario]);

    useEffect(() => {
        idUsuario && verificarNotificacoes();
    }, [idUsuario, verificarNotificacoes]);
    

    return (
        <NotificationContext.Provider value={{ temNotificacao, setTemNotificacao, verificarNotificacoes }}>
            {children}
        </NotificationContext.Provider>
    );
};
