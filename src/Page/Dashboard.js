import React, { useEffect, useState } from 'react';
import Api from '../Api';
import { Link } from 'react-router-dom';
import Table from '../Components/Table';
import { differenceInDays, format, parseISO } from 'date-fns';
import { Button, Modal } from 'react-bootstrap';

const Dashboard = () => {

    const [status, setStatus] = useState({ success: false, message: '' })
    const [dadosAjustes, setDadosAjustes] = useState(null);
    const [dadosInfoUser, setDadosInfoUser] = useState(null);
    const { idUsuario, token } = JSON.parse(localStorage.getItem("user_token"))
    const [modalData, setModalData] = useState({})
    const [showModalRenew, setShowModalRenew] = useState(false);

    useEffect(() => {
        Api.get(`ajustes`).then((response) => {
            setDadosAjustes(response.data[0]);
        });
    }, []);

    const renovarCodigo = async (id, token) => {
        try {

            const response = await Api.put(`renovar-codigo/${id}`, JSON.stringify({ token }), {
                headers: { 'Content-Type': 'application/json' }
            });

            setShowModalRenew(false);
            //Resetar o formulario após enviar e der sucesso
            if (response.data.success === true) {
                setStatus(response.data);
            }
        } catch (error) {
            console.log(error);
            // Mostra uma mensagem de erro genérica ao usuário
            setStatus({
                success: false,
                message: error.response.data.error,
            });
        }
    };

    useEffect(() => {
        Api.get(`info/${idUsuario}`).then((response) => {
            setDadosInfoUser(response.data);
        });
    }, [idUsuario]);

    const [data, setData] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await Api.get(`listar-codigos-vencendo/${idUsuario}`);
                const sortedData = response.data.sort((a, b) => {
                    // Convertendo as strings de data para objetos Date
                    const dateA = new Date(a.data_validade);
                    const dateB = new Date(b.data_validade);
    
                    // Comparando as datas
                    return dateA - dateB;
                });
                setData(sortedData);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [status, idUsuario]);    

    const columns = React.useMemo(
        () => [
            {
                Header: '',
                isVisible: false,
                hideHeader: false,
                id: 'id',
                columns: [
                    {
                        Header: "#",
                        accessor: row => <Link to={`/editar-codigo/${row.id}`}>{row.id ?? '-'}</Link>
                    },
                    {
                        Header: "Código",
                        accessor: row => row.codigo || '-',
                        Cell: ({ cell: { value }, row: { original } }) => (
                            <Link to={`/editar-codigo/${original.id}`}>{value || '-'}</Link>
                        ),
                    },
                    {
                        id: 'data_validade',
                        Header: () => (
                            <div
                                style={{
                                    textAlign: "center"
                                }}
                            >Validade</div>
                        ),
                        accessor: row => row.data_validade || '-',
                        Cell: ({ cell: { value }, row: { original } }) => {
                            let formattedDate = value;
                            let dateClass = '';

                            if (value !== '-') {
                                const currentDate = new Date();
                                const dateObj = parseISO(value);
                                const daysDifference = differenceInDays(dateObj, currentDate);

                                if (daysDifference < 0) {
                                    formattedDate = "Expirado";
                                    dateClass = "text-danger";
                                } else if (daysDifference <= 3) {
                                    dateClass = "text-danger";
                                    formattedDate = format(dateObj, 'dd-MM-yyyy HH:mm');
                                } else if (daysDifference <= 7) {
                                    dateClass = "text-warning";
                                    formattedDate = format(dateObj, 'dd-MM-yyyy HH:mm');
                                } else {
                                    formattedDate = format(dateObj, 'dd-MM-yyyy HH:mm');
                                }
                                // formattedDate = format(dateObj, 'dd-MM-yyyy HH:mm');
                            }

                            return (
                                <div className={`d-flex justify-content-center`}>
                                    <Link className={dateClass} to={`/editar-codigo/${original.id}`}>{formattedDate}</Link>
                                </div>
                            )
                        }
                    },
                    {
                        Header: "Servidor",
                        accessor: row => row.servidor || '-',
                        Cell: ({ cell: { value }, row: { original } }) => (
                            <Link to={`/editar-codigo/${original.id}`}>{value || '-'}</Link>
                        ),
                    },
                    {
                        Header: "Dono",
                        accessor: row => row.nome_dono || '-',
                        Cell: ({ cell: { value }, row: { original } }) => (
                            <Link to={`/editar-codigo/${original.id}`}>{value || '-'}</Link>
                        ),
                    },
                    {
                        id: 'acoes',
                        Header: () => (
                            <div
                                style={{
                                    textAlign: "center"
                                }}
                            >Ações</div>
                        ),
                        accessor: row => row.data_vencimento || '-',
                        Cell: ({ cell: { value }, row: { original } }) => {
                            return (
                                <div className="d-flex justify-content-center">
                                    <Link className='fs-4' onClick={() => { setModalData({ nome: original.codigo, id: original.id, token: token }); setShowModalRenew(true); }} >
                                        <span className="material-symbols-outlined">
                                            calendar_add_on
                                        </span>
                                    </Link>
                                </div>
                            )
                        }
                    },
                ]
            }
        ],
        [token]
    );

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
                {status.message && (
                    <div className={`alert ${status.success ? 'alert-success' : 'alert-danger'} alert-dismissible`} role="alert">
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        <div className="alert-icon">
                            <i className="far fa-fw fa-bell"></i>
                        </div>
                        <div className="alert-message">
                            {status.message}
                        </div>
                    </div>
                )}
                <div className="col">

                    <div className="card">
                    <div className="card-header">
                            <div className="row">
                                <div className="col">
                                    <h5 className="mb-0">Aviso</h5>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div dangerouslySetInnerHTML={{ __html: (dadosAjustes && dadosAjustes.informativo) }}></div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col">
                                    <h5 className="mb-0">Códigos Vencendo</h5>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <Table columns={columns} data={data} />
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal de Renew */}
            <Modal centered show={showModalRenew} onHide={() => setShowModalRenew(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Renovar código por um mês</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Renovar o código <b>{modalData.nome}</b> por mais um mês?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => renovarCodigo(modalData.id, modalData.token)}>
                        Confirmar
                    </Button>
                    <Button variant="secondary" onClick={() => setShowModalRenew(false)}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </main>
    );
}

export default Dashboard;