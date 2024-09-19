import React, { createContext, useState, useEffect, useCallback } from 'react';
import Api from './Api';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [temNotificacao, setTemNotificacao] = useState(false);
    const { idUsuario } = JSON.parse(localStorage.getItem("user_token"));

    const verificarNotificacoes = useCallback(async () => {
        try {
            const response = await Api.get(`verificar-codigo-pendente/${idUsuario}`);
            setTemNotificacao(response.data.codigo_pendente);
        } catch (error) {
            console.error('Erro ao verificar notificações:', error);
        }
    }, [idUsuario]);

    useEffect(() => {
        verificarNotificacoes();
    }, [idUsuario, verificarNotificacoes]);

    return (
        <NotificationContext.Provider value={{ temNotificacao, verificarNotificacoes }}>
            {children}
        </NotificationContext.Provider>
    );
};
