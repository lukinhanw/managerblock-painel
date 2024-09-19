import React, { useContext, useEffect, useState } from 'react';
import { NotificationContext } from "../NotificationContext";
import Api from '../Api';
import { Tooltip } from 'react-tooltip'
import { Link } from 'react-router-dom';

const Header = () => {
    const { temNotificacao } = useContext(NotificationContext);
    const [dadosInfoUser, setDadosInfoUser] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const { idUsuario } = JSON.parse(localStorage.getItem("user_token"));

    useEffect(() => {
        Api.get(`info/${idUsuario}`).then((response) => {
            setDadosInfoUser(response.data);
        });
    }, [idUsuario]);

    const handleButtonClick = () => {
        setIsActive(!isActive);
        const btnToggle = document.querySelector('.btn-toggle-menu');
        const sidebar = document.querySelector('.sidebar-wrapper');
        btnToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
        });
    };

    return (
        <header className={`top-header ${isActive ? 'active' : ''}`}>
            <nav className="navbar navbar-expand justify-content-end">
                {temNotificacao && (
                    <Link to="/listar-codigos">
                        <div className="cursor-pointer" data-tooltip-id="notification-tooltip">
                            <span className="material-symbols-outlined text-warning blink fs-4">notifications</span>
                        </div>
                    </Link>
                )}
                <Tooltip id="notification-tooltip" place="bottom" variant="light" content="Você tem códigos para serem renovados no servidor de origem" />
                <button className="btn-toggle-menu" onClick={handleButtonClick}>
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <div className="product-tags">
                    <button type="button" className="btn btn-light px-4 radius-30">Créditos: <b>{(dadosInfoUser && dadosInfoUser.creditos) || '0'}</b></button>
                </div>
            </nav>
        </header>
    );
};

export default Header;