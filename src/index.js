import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.scss';
import App from './App';
import { AuthProvider } from './Auth/Auth';
import { NotificationProvider } from './NotificationContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
        <NotificationProvider>
            <App />
        </NotificationProvider>
    </AuthProvider>
);