import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.scss';
import App from './App';

// Contextos
import { AuthProvider } from './Context/Auth';
import { NotificationProvider } from './Context/NotificationContext';
import { InfoUserProvider } from './Context/infoUserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <InfoUserProvider>
        <NotificationProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </NotificationProvider>
    </InfoUserProvider>
);