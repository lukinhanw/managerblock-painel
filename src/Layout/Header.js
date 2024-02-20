import React, { useEffect, useState } from 'react';
import Api from '../Api';

const Header = () => {

    const [dadosInfoUser, setDadosInfoUser] = useState(null)
    const { idUsuario } = JSON.parse(localStorage.getItem("user_token"))

    useEffect(() => {
        Api.get(`info/${idUsuario}`).then((response) => {
            setDadosInfoUser(response.data);
        });
    }, [idUsuario]);


    return (
        <header className={`top-header`}>
            <nav className="navbar navbar-expand justify-content-between">
                <div className="product-tags">
                    <button type="button" className="btn btn-light px-4 radius-30">Créditos: <b>{(dadosInfoUser && dadosInfoUser.creditos) || '0'}</b></button>
                </div>
            </nav>
        </header>
    );
}

export default Header;