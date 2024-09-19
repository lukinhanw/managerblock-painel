import React, { useEffect, useState } from 'react';
import Api from '../Api';
import '../Page/Codigos/ListarCodigos.css';

const Header = () => {

    const [dadosInfoUser, setDadosInfoUser] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [temNotificacao, setTemNotificacao] = useState(false); // novo estado para notificações
    const { idUsuario } = JSON.parse(localStorage.getItem("user_token"));

    useEffect(() => {
        Api.get(`info/${idUsuario}`).then((response) => {
            setDadosInfoUser(response.data);
        });

        // Verificar notificações pendentes
        Api.get(`verificar-codigo-pendente/${idUsuario}`).then((response) => {
            if (response.data.codigo_pendente) {
                setTemNotificacao(true);
            }
        });
    }, [idUsuario]);

    const handleButtonClick = () => { // nova função para lidar com o click
        setIsActive(!isActive);

        const btnToggle = document.querySelector('.btn-toggle-menu');
        const sidebar = document.querySelector('.sidebar-wrapper');

        btnToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
        });

    }

    return (
        <header className={`top-header ${isActive ? 'active' : ''}`}>
            <nav className="navbar navbar-expand justify-content-end">
                {temNotificacao && (
                    <div className="notification-icon">
                        <span className="material-symbols-outlined text-warning blink fs-4">notifications</span>
                    </div>
                )}
                <button
                    className="btn-toggle-menu"
                    onClick={handleButtonClick}
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <div className="product-tags">
                    <button type="button" className="btn btn-light px-4 radius-30">Créditos: <b>{(dadosInfoUser && dadosInfoUser.creditos) || '0'}</b></button>
                </div>
            </nav>
        </header>
    );
}

export default Header;