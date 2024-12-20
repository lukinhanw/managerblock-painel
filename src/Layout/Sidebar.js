import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Api from "../Api";
import useAuth from "../Context/hook_useAuth";
import { NotificationContext } from "../Context/NotificationContext";
import '../Components/css/Sidebar.css'; // Importando o CSS para estilos avançados

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signout } = useAuth();
    const { temNotificacao } = useContext(NotificationContext);
    const [dadosInfoUser, setDadosInfoUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState({});
    const { idUsuario } = JSON.parse(localStorage.getItem("user_token"));

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
        setMenuOpen((prevState) => ({
            ...prevState,
            [name]: !prevState[name]
        }));
    };

    const routeToMenuName = (path) => {
        if (path.startsWith('/novo-codigo') || path.startsWith('/listar-codigos')) {
            return 'codigo';
        } else if (path.startsWith('/novo-usuario') || path.startsWith('/listar-usuarios')) {
            return 'usuario';
        } else if (path.startsWith('/novo-teste')) {
            return 'teste';
        } else if (path.startsWith('/novo-revendedor') || path.startsWith('/listar-revendedores')) {
            return 'revendedores';
        } else if (path.startsWith('/logs-pagamentos')) {
            return 'pagamento';
        } else if (path.startsWith('/logs-creditos') || path.startsWith('/logs-acoes')) {
            return 'logs';
        } else {
            return null;
        }
    };

    useEffect(() => {
        const menuName = routeToMenuName(location.pathname);
        if (menuName) {
            setMenuOpen({ [menuName]: true });
        } else {
            setMenuOpen({});
        }
    }, [location.pathname]);

    const [isActive, setIsActive] = useState(false);
    const handleButtonClick = () => {
        setIsActive(!isActive);
    };

    const [info, setInfo] = useState(null);
    useEffect(() => {
        const cachedInfo = JSON.parse(localStorage.getItem('info'));
        if (cachedInfo) {
            setInfo(cachedInfo);
        }

        Api.get(`info-public`).then((response) => {
            const newInfo = response.data[0];
            if (!cachedInfo || cachedInfo.logo !== newInfo.logo) {
                localStorage.setItem('info', JSON.stringify(newInfo));
                setInfo(newInfo);
            }
        });
    }, []);

    return (
        <>
            <aside className={`sidebar-wrapper ${isActive ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-icon" style={{ textAlign: 'center', width: '100%' }}>
                        {info && info.logo && info.logo.length > 10 ? (
                            <img src={info.logo} className="logo-img" alt="" />
                        ) : (
                            <h5 className="mb-0">{info && info.titulo_painel}</h5>
                        )}
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

                                            <li className={location.pathname === '/' ? 'active' : ''}>
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

                                            {/* Menu Código */}
                                            <li className={`${data.exibir_codigos === '0' ? 'd-none' : ''} ${menuOpen.codigo ? 'mm-active' : ''}`}>
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
                                                        {temNotificacao && <span className="text-warning ms-2 blink">•</span>}
                                                    </div>
                                                </Link>

                                                {menuOpen.codigo && (
                                                    <ul className="ms-3">
                                                        <li className={location.pathname === '/novo-codigo' ? 'active' : ''}>
                                                            <Link to="/novo-codigo">
                                                                <span className="material-symbols-outlined">
                                                                    subdirectory_arrow_right
                                                                </span>
                                                                Novo Código
                                                            </Link>
                                                        </li>
                                                        <li className={location.pathname === '/listar-codigos' ? 'active' : ''}>
                                                            <Link to="/listar-codigos">
                                                                <span className="material-symbols-outlined">
                                                                    subdirectory_arrow_right
                                                                </span>
                                                                Listar Códigos {temNotificacao && <span className="text-warning ms-2 blink">•</span>}
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                )}
                                            </li>

                                            {/* Menu Usuários */}
                                            <li className={`${data.exibir_usuarios === '0' ? 'd-none' : ''} ${menuOpen.usuario ? 'mm-active' : ''}`}>
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
                                                        <li className={location.pathname === '/novo-usuario' ? 'active' : ''}>
                                                            <Link to="/novo-usuario">
                                                                <span className="material-symbols-outlined">
                                                                    subdirectory_arrow_right
                                                                </span>
                                                                Novo Usuário
                                                            </Link>
                                                        </li>
                                                        <li className={location.pathname === '/listar-usuarios' ? 'active' : ''}>
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

                                            {/* Menu Teste */}
                                            <li className={menuOpen.teste ? 'mm-active' : ''}>
                                                <Link to="#" onClick={() => toggleMenu("teste")}>
                                                    <div className="parent-icon">
                                                        <span className="material-symbols-outlined">
                                                            edit_document
                                                        </span>
                                                    </div>
                                                    <div className="menu-title d-flex justify-content-between" >
                                                        Teste
                                                        <span className="arrow-icon material-symbols-outlined">
                                                            {menuOpen.teste ? 'expand_less' : 'expand_more'}
                                                        </span>
                                                    </div>
                                                </Link>

                                                {menuOpen.teste && (
                                                    <ul className="ms-3">
                                                        <li className={location.pathname === '/novo-teste' ? 'active' : ''}>
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

                                            {/* Menu Revendedores */}
                                            {dadosInfoUser && dadosInfoUser.id_dono === 0 && (
                                                <li className={menuOpen.revendedores ? 'mm-active' : ''}>
                                                    <Link to="#" onClick={() => toggleMenu("revendedores")}>
                                                        <div className="parent-icon">
                                                            <span className="material-symbols-outlined">
                                                                group
                                                            </span>
                                                        </div>
                                                        <div className="menu-title d-flex justify-content-between" >
                                                            Revendedores
                                                            <span className="arrow-icon material-symbols-outlined">
                                                                {menuOpen.revendedores ? 'expand_less' : 'expand_more'}
                                                            </span>
                                                        </div>
                                                    </Link>

                                                    {menuOpen.revendedores && (
                                                        <ul className="ms-3">
                                                            <li className={location.pathname === '/novo-revendedor' ? 'active' : ''}>
                                                                <Link to="/novo-revendedor">
                                                                    <span className="material-symbols-outlined">
                                                                        subdirectory_arrow_right
                                                                    </span>
                                                                    Novo Revendedor
                                                                </Link>
                                                            </li>

                                                            <li className={location.pathname === '/listar-revendedores' ? 'active' : ''}>
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
                                            )}

                                            {/* Menu Pagamentos */}
                                            {(dadosInfoUser && (dadosInfoUser.renovacoes_automaticas === 1 || dadosInfoUser.id_dono === 0)) && (
                                                <>
                                                    <li className="menu-label mt-3 mb-2">
                                                        Pagamentos
                                                    </li>
                                                    <li className={menuOpen.pagamento ? 'mm-active' : ''}>
                                                        <Link to="#" onClick={() => toggleMenu("pagamento")}>
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

                                                        {menuOpen.pagamento && (
                                                            <ul className="ms-3">
                                                                <li className={location.pathname === '/logs-pagamentos' ? 'active' : ''}>
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
                                                </>
                                            )}

                                            <li className="menu-label mt-3 mb-2">
                                                Relatórios
                                            </li>

                                            {/* Menu Logs do Sistema */}
                                            <li className={menuOpen.logs ? 'mm-active' : ''}>
                                                <Link to="#" onClick={() => toggleMenu("logs")}>
                                                    <div className="parent-icon">
                                                        <span className="material-symbols-outlined">
                                                            description
                                                        </span>
                                                    </div>
                                                    <div className="menu-title d-flex justify-content-between" >
                                                        Logs do Sistema
                                                        <span className="arrow-icon material-symbols-outlined">
                                                            {menuOpen.logs ? 'expand_less' : 'expand_more'}
                                                        </span>
                                                    </div>
                                                </Link>

                                                {menuOpen.logs && (
                                                    <ul className="ms-3">
                                                        <li className={location.pathname === '/logs-creditos' ? 'active' : ''}>
                                                            <Link to="/logs-creditos">
                                                                <span className="material-symbols-outlined">
                                                                    subdirectory_arrow_right
                                                                </span>
                                                                Logs de Créditos
                                                            </Link>
                                                        </li>
                                                        <li className={location.pathname === '/logs-acoes' ? 'active' : ''}>
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

                                            {/* Menu Ajustes */}
                                            {dadosInfoUser && dadosInfoUser.id_dono === 0 && (
                                                <li className={location.pathname === '/ajustes' ? 'active' : ''}>
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
                                            )}

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
            <button className="btn-toggle-menu" onClick={handleButtonClick}>
                <span className="material-symbols-outlined">menu</span>
            </button>
        </>
    );
};

export default Sidebar;