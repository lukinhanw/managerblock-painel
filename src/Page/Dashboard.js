import React, { useEffect, useState } from 'react';
import Api from '../Api';

const Dashboard = () => {

    const [dadosAjustes, setDadosAjustes] = useState(null);
    const [dadosInfoUser, setDadosInfoUser] = useState(null);

    useEffect(() => {
        Api.get(`ajustes`).then((response) => {
            setDadosAjustes(response.data[0]);
        });
    }, []);


	const { idUsuario } = JSON.parse(localStorage.getItem("user_token"))

    useEffect(() => {
        Api.get(`info/${idUsuario}`).then((response) => {
            setDadosInfoUser(response.data);
        });
    }, [idUsuario]);

    return (
        <main className="page-content">
            <h6 className="text-uppercase">Dashboard</h6>
            <hr />
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-xl-4 row-cols-xxl-4">
                <div className="col">
                    <div className="card radius-10 border-0 border-start border-primary border-4">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="">
                                    <p className="mb-1">Códigos</p>
                                    <h4 className="mb-0 text-primary">{(dadosInfoUser && dadosInfoUser.quantidade_codigos) || '0'}</h4>
                                </div>
                                <div className="ms-auto widget-icon bg-primary text-white">
                                    <span className="material-symbols-outlined"> password </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card radius-10 border-0 border-start border-light border-4">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="">
                                    <p className="mb-1">Testes</p>
                                    <h4 className="mb-0 text-light">{(dadosInfoUser && dadosInfoUser.quantidade_testes) || '0'}</h4>
                                </div>
                                <div className="ms-auto widget-icon bg-light text-white">
                                    <span className="material-symbols-outlined">
                                        edit_document
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card radius-10 border-0 border-start border-warning border-4">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="">
                                    <p className="mb-1">Revendedores</p>
                                    <h4 className="mb-0 text-warning">{(dadosInfoUser && dadosInfoUser.quantidade_revendedores) || '0'}</h4>
                                </div>
                                <div className="ms-auto widget-icon bg-warning text-white">
                                    <span className="material-symbols-outlined">
                                        group
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card radius-10 border-0 border-start border-success border-4">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="">
                                    <p className="mb-1">Créditos</p>
                                    <h4 className="mb-0 text-success">{(dadosInfoUser && dadosInfoUser.creditos) || '0'}</h4>
                                </div>
                                <div className="ms-auto widget-icon bg-success text-white">
                                    <span className="material-symbols-outlined">
                                        monetization_on
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className="col">

                    <div className="card">
                        <div className="card-body">
                            <div dangerouslySetInnerHTML={{ __html: (dadosAjustes && dadosAjustes.informativo) }}></div>
                         </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Dashboard;