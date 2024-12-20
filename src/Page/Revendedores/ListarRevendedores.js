import React, { useEffect, useState } from "react";
import Table from "../../Components/Table";
import { Link } from "react-router-dom";
import Api from "../../Api";
import { Button, Modal } from "react-bootstrap";
import { Tooltip } from 'react-tooltip';

const ListarRevendedores = () => {
    const [status, setStatus] = useState({ success: false, message: "" });
    const { idUsuario, token } = JSON.parse(localStorage.getItem("user_token"))

    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalBlock, setShowModalBlock] = useState(false);
    const [showModalUnblock, setShowModalUnblock] = useState(false);
    const [showModalCreditos, setShowModalCreditos] = useState(false);

    const [creditValue, setCreditValue] = useState(0);

    const [modalData, setModalData] = useState({});

    const deletarUsuario = async (id) => {
        try {
            const response = await Api.delete(`deletar-revendedor/${id}`, {
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
                message: "Ocorreu um erro ao apagar o usuário. Tente novamente mais tarde.",
            });
        }
    };

    const bloquearUsuario = async (id) => {
        try {
            const response = await Api.put(`bloquear-revendedor/${id}`, JSON.stringify({ token: token }), {
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
                message: "Ocorreu um erro ao bloquear o usuário. Tente novamente mais tarde.",
            });
        }
    };

    const desbloquearUsuario = async (id) => {
        try {
            const response = await Api.put(`desbloquear-revendedor/${id}`, JSON.stringify({ token: token }), {
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

    const handleCreditChange = async () => {
        try {
            const response = await Api.put(`trocar-creditos/${modalData.id}`, { creditos: creditValue, token: token });
            setShowModalCreditos(false)
            setCreditValue(0)
            if (response.data.success === true) {
                setStatus(response.data);
            }
        } catch (error) {
            setStatus({
                success: false,
                message: error.response.data.error,
            });
        }
    };

    const columns = React.useMemo(
        () => [
            {
                Header: "",
                isVisible: false,
                hideHeader: false,
                id: "id",
                columns: [
                    {
                        Header: "#",
                        accessor: row => row.id || '-',
                    },
                    {
                        Header: "Nome Completo",
                        accessor: (row) => row.nome || "-",
                        Cell: ({ cell: { value }, row: { original } }) => (
                            <Link to={`/editar-revendedor/${original.id}`} className="d-flex flex-column align-items-start">
                                <span className="font-weight-bold text-white">{original.nome}</span>

                                <div className="d-flex align-items-center">
                                    {original.status === 0 ?
                                        <span className="lable-table bg-success-subtle text-success rounded border border-success-subtle font-text2 fw-bold">
                                            Ativo
                                        </span>
                                        :
                                        <span className="lable-table bg-danger-subtle text-danger rounded border border-danger-subtle font-text2 fw-bold">
                                            Bloqueado
                                        </span>
                                    }
                                    <div className='ms-1 lable-table bg-warning-subtle text-warning rounded border border-warning-subtle font-text2 fw-bold'>Créditos: {original.creditos}</div>
                                    {original.renovacoes_automaticas ? <div className='ms-1 lable-table bg-secondary-subtle text-secondary rounded border border-secondary-subtle font-text2 fw-bold'><span className="material-symbols-outlined">paid</span></div> : ''}
                                </div>
                            </Link>

                        ),
                    },
                    {
                        Header: "E-mail",
                        accessor: (row) => row.email || "-",
                        Cell: ({ cell: { value }, row: { original } }) => (
                            <Link to={`/editar-revendedor/${original.id}`}>
                                {value || "-"}
                            </Link>
                        ),
                    },
                    {
                        id: "usuario",
                        Header: () => (
                            <div style={{ textAlign: "center" }}>Usuário</div>
                        ),
                        accessor: (row) => row.usuario_painel || "-",
                        Cell: ({ cell: { value }, row: { original } }) => (
                            <div className="d-flex justify-content-center flex-column align-items-center">
                                <Link to={`/editar-revendedor/${original.id}`}>
                                    {value || "-"}
                                </Link>
                                <div className="d-flex align-items-center">
                                    <span className="lable-table bg-info-subtle text-info rounded border border-info-subtle font-text2 fw-bold">
                                        Clientes: {original.quantidade_codigos}
                                    </span>
                                </div>
                            </div>
                        ),
                    },
                    {
                        Header: "WhatsApp",
                        accessor: (row) => row.whatsapp || "-",
                        Cell: ({ cell: { value }, row: { original } }) => (
                            <Link to={`http://wa.me/${original.id}`} target="_blank">
                                {value || "-"}
                            </Link>
                        ),
                    },
                    {
                        Header: "Dono",
                        accessor: (row) => row.nome_dono || "-",
                        Cell: ({ cell: { value }, row: { original } }) => (
                            <Link to={`/editar-revendedor/${original.id}`}>
                                {value || "-"}
                            </Link>
                        ),
                    },
                    {
                        id: "acoes",
                        Header: () => (
                            <div style={{ textAlign: "center" }}>
                                Ações
                            </div>
                        ),
                        accessor: (row) => row.data_vencimento || "-",
                        Cell: ({ cell: { value }, row: { original } }) => {
                            return (
                                <div className="d-flex justify-content-center align-items-center">
                                    <Link 
                                        className="fs-4 me-2" 
                                        to={`/editar-revendedor/${original.id}`}
                                        data-tooltip-id="edit-tooltip"
                                        data-tooltip-content="Editar revendedor"
                                    >
                                        <span className="material-symbols-outlined">
                                            edit
                                        </span>
                                    </Link>
                                    <Link 
                                        className="fs-4 me-2"
                                        onClick={() => {
                                            setModalData({ nome: original.nome, id: original.id });
                                            setShowModalCreditos(true);
                                        }}
                                        data-tooltip-id="credit-tooltip"
                                        data-tooltip-content="Gerenciar créditos"
                                    >
                                        <span className="material-symbols-outlined">
                                            attach_money
                                        </span>
                                    </Link>
                                    <Link 
                                        className="fs-4 me-2"
                                        onClick={() => {
                                            setModalData({ nome: original.nome, id: original.id });
                                            original.status === 1 ? setShowModalUnblock(true) : setShowModalBlock(true)
                                        }}
                                        data-tooltip-id="block-tooltip"
                                        data-tooltip-content={original.status === 1 ? "Desbloquear revendedor" : "Bloquear revendedor"}
                                    >
                                        <span className="material-symbols-outlined">
                                            {original.status === 1 ? 'lock_open' : 'lock'}
                                        </span>
                                    </Link>
                                    <Link 
                                        className="fs-4 me-2"
                                        onClick={() => {
                                            setModalData({ nome: original.nome, id: original.id });
                                            setShowModalDelete(true);
                                        }}
                                        data-tooltip-id="delete-tooltip"
                                        data-tooltip-content="Excluir revendedor"
                                    >
                                        <span className="material-symbols-outlined">
                                            delete
                                        </span>
                                    </Link>
                                    {/* Tooltips */}
                                    <Tooltip id="edit-tooltip" place="top" />
                                    <Tooltip id="credit-tooltip" place="top" />
                                    <Tooltip id="block-tooltip" place="top" />
                                    <Tooltip id="delete-tooltip" place="top" />
                                </div>
                            );
                        },
                    },
                ],
            },
        ],
        []
    );

    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await Api.get(`listar-revendedores/${idUsuario}`);
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
                <h6 className="text-uppercase">Lista de Revendedores</h6>
                <hr />
                <div className="row">
                    <div className="col-lg-12 mx-auto">
                        <div className="card">
                            <div className="card-header px-4 py-3 bg-transparent">
                                <h5 className="mb-0">Todos os Revendedores</h5>
                            </div>
                            <div className="card-body p-4">
                                {status.message && (
                                    <div className={`alert ${status.success ? "alert-success" : "alert-danger"} alert-dismissible`} role="alert">
                                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" ></button>
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
                    <button className="btn btn-primary" onClick={() => { deletarUsuario(modalData.id) }} >
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
                    <Button variant="primary" onClick={() => bloquearUsuario(modalData.id)}>
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
                    <Button variant="primary" onClick={() => desbloquearUsuario(modalData.id)}>
                        Confirmar
                    </Button>
                    <Button variant="secondary" onClick={() => setShowModalUnblock(false)}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Adicionar e Remover Creditos */}
            <Modal centered show={showModalCreditos} onHide={() => setShowModalCreditos(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar/Remover Créditos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="credit-value" className="form-label">Quantidade:</label>
                            <input type="number" className="form-control" id="credit-value" value={creditValue} onChange={(e) => setCreditValue(e.target.value)} />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCreditChange}>
                        Confirmar
                    </Button>
                    <Button variant="secondary" onClick={() => setShowModalCreditos(false)}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
};

export default ListarRevendedores;
