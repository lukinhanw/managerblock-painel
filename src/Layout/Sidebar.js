import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../Api";
import useAuth from "../Auth/hook_useAuth";

const Sidebar = () => {

    const navigate = useNavigate();
    const { signout } = useAuth();

    const [dadosInfoUser, setDadosInfoUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState({});  // Adicionado aqui


    const { idUsuario } = JSON.parse(localStorage.getItem("user_token"))
    useEffect(() => {
        Api.get(`info/${idUsuario}`).then((response) => {
            setDadosInfoUser(response.data);
        });
    }, [idUsuario]);

    const [data, setData] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await Api.get('ajustes');
                setData(response.data[0]);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    const toggleMenu = (name) => {
        setMenuOpen({
            ...menuOpen,
            [name]: !menuOpen[name]
        });
    };

    const [isActive, setIsActive] = useState(false)
    const handleButtonClick = () => { // nova função para lidar com o click
        setIsActive(!isActive);

        const sidebar = document.querySelector('.sidebar-wrapper');
        const sidebarClose = document.querySelector('.sidebar-close');

        sidebarClose.addEventListener('click', function () {
            sidebar.classList.toggle('active');
        });
    }

    const [info, setInfo] = useState(null);
    useEffect(() => {
        Api.get(`info-public`).then((response) => {
            setInfo(response.data[0]);
        });
    }, []);

    return (
        <>
            <aside className="sidebar-wrapper">
                <div className="sidebar-header">
                    <div className="logo-icon">
                        <img src={info && info.logo} className="logo-img" alt="" />
                    </div>
                    <div className="logo-name flex-grow-1">
                        <h5 className="mb-0">{data.titulo_painel}</h5>
                    </div>
                    <div className="sidebar-close" onClick={handleButtonClick}>
                        <span className="material-symbols-outlined">close</span>
                    </div>
                </div>
                <div className="sidebar-nav" data-simplebar="init">
                    <div className="simplebar-wrapper m-0">
                        <div className="simplebar-height-auto-observer-wrapper">
                            <div className="simplebar-height-auto-observer"></div>
                        </div>
                        <div className="simplebar-mask">
                            <div className="simplebar-offset" style={{ right: "0px", bottom: "0px" }} >
                                <div className="simplebar-content-wrapper" style={{ height: "100%", overflow: "hidden scroll" }} >
                                    <div className="simplebar-content mm-active p-0">
                                        <ul className="metismenu mm-show" id="menu">

                                            <li className="menu-label mt-3 mb-2">
                                                Painel de Controle
                                            </li>

                                            <li>
                                                <Link to="/">
                                                    <div className="parent-icon">
                                                        <span className="material-symbols-outlined">
                                                            home
                                                        </span>
                                                    </div>
                                                    <div className="menu-title">
                                                        Dashboard
                                                    </div>
                                                </Link>
                                            </li>

                                            <li className="menu-label mt-3 mb-2">
                                                Usuários e Revendedores
                                            </li>

                                            <li className={data.exibir_codigos === '0' ? 'd-none' : ''}>
                                                <Link to="#" onClick={() => toggleMenu("codigo")}>
                                                    <div className="parent-icon">
                                                        <span className="material-symbols-outlined">
                                                            monetization_on
                                                        </span>
                                                    </div>
                                                    <div className="menu-title d-flex justify-content-between" >
                                                        Código
                                                        <span className="arrow-icon material-symbols-outlined">
                                                            {menuOpen.codigo ? 'expand_less' : 'expand_more'}
                                                        </span>
                                                    </div>
                                                </Link>

                                                {menuOpen.codigo && (
                                                    <ul className="ms-3">
                                                        <li>
                                                            <Link to="/novo-codigo">
                                                                <span className="material-symbols-outlined">
                                                                    subdirectory_arrow_right
                                                                </span>
                                                                Novo Código
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="/listar-codigos">
                                                                <span className="material-symbols-outlined">
                                                                    subdirectory_arrow_right
                                                                </span>
                                                                Listar Códigos
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                )}
                                            </li>

                                            <li className={data.exibir_usuarios === '0' ? 'd-none' : ''}>
                                                <Link to="#" onClick={() => toggleMenu("usuario")}>
                                                    <div className="parent-icon">
                                                        <span className="material-symbols-outlined">
                                                            person
                                                        </span>
                                                    </div>
                                                    <div className="menu-title d-flex justify-content-between" >
                                                        Usuários
                                                        <span className="arrow-icon material-symbols-outlined">
                                                            {menuOpen.usuario ? 'expand_less' : 'expand_more'}
                                                        </span>
                                                    </div>
                                                </Link>

                                                {menuOpen.usuario && (
                                                    <ul className="ms-3">
                                                        <li>
                                                            <Link to="/novo-usuario">
                                                                <span className="material-symbols-outlined">
                                                                    subdirectory_arrow_right
                                                                </span>
                                                                Novo Usuário
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="/listar-usuarios">
                                                                <span className="material-symbols-outlined">
                                                                    subdirectory_arrow_right
                                                                </span>
                                                                Listar Usuários
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                )}
                                            </li>

                                            <li>
                                                <Link to="#" onClick={() => toggleMenu("teste")}>
                                                    <div className="parent-icon">
                                                        <span className="material-symbols-outlined">
                                                            edit_document
                                                        </span>
                                                    </div>
                                                    <div className="menu-title d-flex justify-content-between" >
                                                        Teste
                                                        <span className="arrow-icon material-symbols-outlined">
                                                            {menuOpen.codigo ? 'expand_less' : 'expand_more'}
                                                        </span>
                                                    </div>
                                                </Link>

                                                {menuOpen.teste && (
                                                    <ul className="ms-3">
                                                        <li>
                                                            <Link to="/novo-teste">
                                                                <span className="material-symbols-outlined">
                                                                    subdirectory_arrow_right
                                                                </span>
                                                                Novo Teste - {dadosInfoUser && dadosInfoUser.hora_teste} Hora(s)
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                )}
                                            </li>

                                            <li>
                                                <Link to="#" onClick={() => toggleMenu("revendedores")}>
                                                    <div className="parent-icon">
                                                        <span className="material-symbols-outlined">
                                                            group
                                                        </span>
                                                    </div>
                                                    <div className="menu-title d-flex justify-content-between" >
                                                        Revendedores
                                                        <span className="arrow-icon material-symbols-outlined">
                                                            {menuOpen.codigo ? 'expand_less' : 'expand_more'}
                                                        </span>
                                                    </div>
                                                </Link>

                                                {menuOpen.revendedores && (
                                                    <ul className="ms-3">
                                                        {dadosInfoUser && dadosInfoUser.id_dono === 0 ?
                                                            (
                                                                <li>
                                                                    <Link to="/novo-revendedor">
                                                                        <span className="material-symbols-outlined">
                                                                            subdirectory_arrow_right
                                                                        </span>
                                                                        Novo Revendedor
                                                                    </Link>
                                                                </li>
                                                            ) : ''
                                                        }
                                                        <li>
                                                            <Link to="/listar-revendedores">
                                                                <span className="material-symbols-outlined">
                                                                    subdirectory_arrow_right
                                                                </span>
                                                                Listar Revendedores
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                )}
                                            </li>

                                            <li className="menu-label mt-3 mb-2">
                                                Pagamentos
                                            </li>

                                            <li>
                                                <Link to="#" onClick={() => toggleMenu("logs")}>
                                                    <div className="parent-icon">
                                                    <span className="material-symbols-outlined"> paid </span>
                                                    </div>
                                                    <div className="menu-title d-flex justify-content-between" >
                                                        Pagamentos
                                                        <span className="arrow-icon material-symbols-outlined">
                                                            {menuOpen.pagamento ? 'expand_less' : 'expand_more'}
                                                        </span>
                                                    </div>
                                                </Link>

                                                {menuOpen.logs && (
                                                    <ul className="ms-3">
                                                        <li>
                                                            <Link to="/logs-pagamentos">
                                                                <span className="material-symbols-outlined">
                                                                    subdirectory_arrow_right
                                                                </span>
                                                                Consultar Pagamentos
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                )}
                                            </li>




                                            <li className="menu-label mt-3 mb-2">
                                                Relatórios
                                            </li>

                                            <li>
                                                <Link to="#" onClick={() => toggleMenu("logs")}>
                                                    <div className="parent-icon">
                                                        <span className="material-symbols-outlined">
                                                            description
                                                        </span>
                                                    </div>
                                                    <div className="menu-title d-flex justify-content-between" >
                                                        Logs do Sistema
                                                        <span className="arrow-icon material-symbols-outlined">
                                                            {menuOpen.codigo ? 'expand_less' : 'expand_more'}
                                                        </span>
                                                    </div>
                                                </Link>

                                                {menuOpen.logs && (
                                                    <ul className="ms-3">
                                                        <li>
                                                            <Link to="/logs-creditos">
                                                                <span className="material-symbols-outlined">
                                                                    subdirectory_arrow_right
                                                                </span>
                                                                Logs de Créditos
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="/logs-acoes">
                                                                <span className="material-symbols-outlined">
                                                                    subdirectory_arrow_right
                                                                </span>
                                                                Logs de Ações
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                )}
                                            </li>


                                            <li className="menu-label mt-3 mb-2">
                                                Configurações
                                            </li>

                                            {dadosInfoUser && dadosInfoUser.id_dono === 0 ?
                                                (
                                                    <li>
                                                        <Link to="/ajustes">
                                                            <div className="parent-icon">
                                                                <span className="material-symbols-outlined">
                                                                    settings
                                                                </span>
                                                            </div>
                                                            <div className="menu-title">
                                                                Ajustes
                                                            </div>
                                                        </Link>
                                                    </li>
                                                ) : ''
                                            }

                                            <li>
                                                <Link onClick={() => [signout(), navigate("/")]}>
                                                    <div className="parent-icon">
                                                        <span className="material-symbols-outlined">
                                                            logout
                                                        </span>
                                                    </div>
                                                    <div className="menu-title">
                                                        Sair
                                                    </div>
                                                </Link>
                                            </li>

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                <Link to="/perfil">
                    <div className="sidebar-bottom dropdown dropup-center dropup">
                        <div className="d-flex align-items-center px-3 gap-3 w-100 h-100">
                            <div className="user-img">
                                <img src="https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png" alt="" />
                            </div>
                            <div className="user-info">
                                <h5 className="mb-0 user-name">{dadosInfoUser && dadosInfoUser.nome}</h5>
                                <p className="mb-0 user-designation">{dadosInfoUser && dadosInfoUser.id_dono === 0 ? 'Administrador' : 'Revendedor'}</p>
                            </div>
                        </div>
                    </div>
                </Link>

            </aside >
        </>
    );
};

export default Sidebar;
