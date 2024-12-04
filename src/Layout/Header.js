import React, { useContext, useEffect, useState } from 'react';
import { NotificationContext } from '../Context/NotificationContext';
import Api from '../Api';
import { Tooltip } from 'react-tooltip';
import { Link } from 'react-router-dom';

const Header = () => {
    const { temNotificacao } = useContext(NotificationContext);
    const [dadosInfoUser, setDadosInfoUser] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const { idUsuario } = JSON.parse(localStorage.getItem("user_token"));
    const [headerColor, setHeaderColor] = useState(localStorage.getItem('headerColor') || 'gradient1');

    useEffect(() => {
        Api.get(`info/${idUsuario}`).then((response) => {
            const newInfo = response.data;
            localStorage.setItem('info', JSON.stringify(newInfo));
            setDadosInfoUser(newInfo);

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

    const handleColorChange = (color) => {
        setHeaderColor(color);
        localStorage.setItem('headerColor', color);
    };

    console.log("a", dadosInfoUser);


    return (
        <header className={`top-header ${isActive ? 'active' : ''}`}>
            <nav className={`navbar navbar-expand justify-content-end ${headerColor}`}>
                {temNotificacao && (
                    <Link to="/listar-codigos">
                        <div className="cursor-pointer" data-tooltip-id="notification-tooltip">
                            <span className="material-symbols-outlined text-warning blink fs-4">notifications</span>
                        </div>
                    </Link>
                )}
                <Tooltip id="notification-tooltip" place="bottom" variant="light" content="Você tem códigos para serem renovados no servidor de origem" />
                <button className="btn-toggle-menu me-1" onClick={handleButtonClick}>
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <div className="dropdown">
                    <button className="btn btn-light dropdown-toggle me-3" type="button" id="colorDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        <span className="material-symbols-outlined">palette</span>
                    </button>
                    <div className="dropdown-menu p-3" aria-labelledby="colorDropdown">
                        <div className="d-flex flex-wrap justify-content-between">
                            <button className="color-circle gradient1" onClick={() => handleColorChange('gradient1')}></button>
                            <button className="color-circle gradient2" onClick={() => handleColorChange('gradient2')}></button>
                            <button className="color-circle gradient3" onClick={() => handleColorChange('gradient3')}></button>
                            <button className="color-circle gradient4" onClick={() => handleColorChange('gradient4')}></button>
                            <button className="color-circle gradient5" onClick={() => handleColorChange('gradient5')}></button>
                            <button className="color-circle gradient6" onClick={() => handleColorChange('gradient6')}></button>
                        </div>
                    </div>
                </div>
                <div className="product-tags">
                    <button type="button" className="btn btn-light px-4 radius-30">Créditos: <b>{(dadosInfoUser && dadosInfoUser.creditos) || '0'}</b></button>
                </div>
            </nav>
        </header>
    );
};

export default Header;