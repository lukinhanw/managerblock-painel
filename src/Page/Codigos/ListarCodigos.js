import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';

import Table from "../../Components/Table"
import { Link } from 'react-router-dom';
import Api from '../../Api';
import { Button, Modal } from 'react-bootstrap';


const ListarCodigos = () => {

    const [status, setStatus] = useState({ success: false, message: '' })
    const { idUsuario, token } = JSON.parse(localStorage.getItem("user_token"))

    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalBlock, setShowModalBlock] = useState(false);
    const [showModalUnblock, setShowModalUnblock] = useState(false);
    const [showModalRenew, setShowModalRenew] = useState(false);

    const [modalData, setModalData] = useState({});

    const renovarCodigo = async (id, token) => {
        try {

            const response = await Api.put(`renovar-codigo/${id}`, JSON.stringify({token}), {
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

    const deletarCodigo = async (id) => {
        try {
            const response = await Api.delete(`deletar-codigo/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setShowModalDelete(false);
            //Resetar o formulario após enviar e der sucesso
            if (response.data.success === true) {
                setStatus(response.data);
            }
        } catch (error) {
            console.log(error);
            // Mostra uma mensagem de erro genérica ao usuário
            setStatus({
                success: false,
                message: "Ocorreu um erro ao apagar o código. Tente novamente mais tarde.",
            });
        }
    };

    const bloquearCodigo = async (id) => {
        try {
            const response = await Api.put(`bloquear-codigo/${id}`, JSON.stringify({ token: token }), {
                headers: { 'Content-Type': 'application/json' }
            });

            setShowModalBlock(false);
            if (response.data.success === true) {
                setStatus(response.data);
            }
        } catch (error) {
            console.error(error);
            setStatus({
                success: false,
                message: "Ocorreu um erro ao bloquear o código. Tente novamente mais tarde.",
            });
        }
    };

    const desbloquearCodigo = async (id) => {
        try {

            const response = await Api.put(`desbloquear-codigo/${id}`, JSON.stringify({ token: token }), {
                headers: { 'Content-Type': 'application/json' }
            });
            setShowModalUnblock(false);
            if (response.data.success === true) {
                setStatus(response.data);
            }
        } catch (error) {
            console.error(error);
            setStatus({
                success: false,
                message: "Ocorreu um erro ao desbloquear o usuário. Tente novamente mais tarde.",
            });
        }
    };

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
                        Header: "Nome Completo",
                        accessor: row => row.nome || '-',
                        Cell: ({ cell: { value }, row: { original } }) => (
                            <Link to={`/editar-codigo/${original.id}`} className="d-flex align-items-center gap-3">
                                {original.status === 0 ?
                                    <span className="lable-table bg-success-subtle text-success rounded border border-success-subtle font-text2 fw-bold">
                                        Ativo
                                    </span>
                                    :
                                    <span className="lable-table bg-danger-subtle text-danger rounded border border-danger-subtle font-text2 fw-bold">
                                        Bloqueado
                                    </span>
                                }
                                {
                                    original.tipo === 'teste' ?
                                        <span className="lable-table bg-warning-subtle text-warning rounded border border-warning-subtle font-text2 fw-bold">
                                            Teste
                                        </span> : ''
                                }


                                <span>{value}</span>
                            </Link>
                        ),
                    },
                    {
                        Header: "Código",
                        accessor: row => row.codigo || '-',
                        Cell: ({ cell: { value }, row: { original } }) => (
                            <Link to={`/editar-codigo/${original.id}`}>{value || '-'}</Link>
                        ),
                    },
                    {
                        Header: "WhatsApp",
                        accessor: row => row.whatsapp || '-',
                        Cell: ({ cell: { value }, row: { original } }) => (
                            <Link to={`http://wa.me/${original.id}`} target='_blank'>{value || '-'}</Link>
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
                            if (value !== '-') {
                                const dateObj = parseISO(value);
                                formattedDate = format(dateObj, 'dd-MM-yyyy HH:mm');
                            }
                            return (
                                <div className="d-flex justify-content-center">
                                    <Link to={`/editar-codigo/${original.id}`}>{formattedDate}</Link>
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
                        Header: "Usuário",
                        accessor: row => row.usuario_servidor || '-',
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
                                <div className="d-flex justify-content-between">
                                    <Link className='fs-4' to={`/editar-codigo/${original.id}`}>
                                        <span className="material-symbols-outlined">
                                            edit
                                        </span>
                                    </Link>
                                    <Link className='fs-4' onClick={() => { setModalData({ nome: original.codigo, id: original.id, token: token }); setShowModalRenew(true); }} >
                                        <span className="material-symbols-outlined">
                                            calendar_add_on
                                        </span>
                                    </Link>
                                    <Link className="fs-4"
                                        onClick={() => {
                                            setModalData({ nome: original.nome, id: original.id });
                                            original.status === 1 ? setShowModalUnblock(true) : setShowModalBlock(true)
                                        }}
                                    >
                                        <span className="material-symbols-outlined">
                                            {original.status === 1 ? 'lock_open' : 'lock'}
                                        </span>
                                    </Link>
                                    <Link className='fs-4' onClick={() => { setModalData({ nome: original.codigo, id: original.id }); setShowModalDelete(true); }}>
                                        <span className="material-symbols-outlined">
                                            delete
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

    const [data, setData] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await Api.get(`listar-codigos/${idUsuario}`);
                setData(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [status, idUsuario]);

    return (
        <>
            <main className="page-content">
                <h6 className="text-uppercase">Lista de Códigos</h6>
                <hr />
                <div className='row'>
                    <div className="col-lg-12 mx-auto">
                        <div className="card">
                            <div className="card-header px-4 py-3 bg-transparent">
                                <h5 className="mb-0">Todos os códigos</h5>
                            </div>
                            <div className="card-body p-4">
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
                                <Table columns={columns} data={data} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal de deletar */}
            <Modal centered show={showModalDelete} onHide={() => setShowModalDelete(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmação</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Tem certeza que deseja deletar o registro de: <b>{modalData.nome}</b> ?
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={() => { deletarCodigo(modalData.id) }} >
                        Confirmar
                    </button>
                    <button className="btn btn-secondary" onClick={() => setShowModalDelete(false)} >
                        Cancelar
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Modal de bloqueio */}
            <Modal centered show={showModalBlock} onHide={() => setShowModalBlock(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Bloquear Revendedor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Você tem certeza que deseja bloquear o revendedor <b>{modalData.nome}</b>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => bloquearCodigo(modalData.id)}>
                        Confirmar
                    </Button>
                    <Button variant="secondary" onClick={() => setShowModalBlock(false)}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de desbloqueio */}
            <Modal centered show={showModalUnblock} onHide={() => setShowModalUnblock(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Desbloquear Revendedor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Você tem certeza que deseja desbloquear o revendedor <b>{modalData.nome}</b>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => desbloquearCodigo(modalData.id)}>
                        Confirmar
                    </Button>
                    <Button variant="secondary" onClick={() => setShowModalUnblock(false)}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

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

        </>
    );
}

export default ListarCodigos;