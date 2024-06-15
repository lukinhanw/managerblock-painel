import React, { useEffect, useState } from 'react';
import Table from "../../Components/Table"
import { Link } from 'react-router-dom';
import Api from '../../Api';
import { Button, Modal } from 'react-bootstrap';
import { checkDateStatus } from '../../Components/Utils';


const ListarRenovacao = () => {

    const [status, setStatus] = useState({ success: false, message: '' })
    const { idUsuario, token } = JSON.parse(localStorage.getItem("user_token"))

    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalBlock, setShowModalBlock] = useState(false);
    const [showModalUnblock, setShowModalUnblock] = useState(false);
    const [showModalRenew, setShowModalRenew] = useState(false);

    const [modalData, setModalData] = useState({});

    const renovarUsuario = async (id, token) => {
        try {

            const response = await Api.put(`renovar-usuario/${id}`, JSON.stringify({ token }), {
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

    const deletarUsuario = async (id) => {
        try {
            const response = await Api.delete(`deletar-usuario/${id}`, {
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
            const response = await Api.put(`bloquear-usuario/${id}`, JSON.stringify({ token: token }), {
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

    const desbloquearUsuario = async (id) => {
        try {

            const response = await Api.put(`desbloquear-usuario/${id}`, JSON.stringify({ token: token }), {
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
                        Header: "Usuário",
                        accessor: row => `${row.nome || '-'} ${row.usuario || ''} ${row.whatsapp || ''}`,
                        Cell: ({ cell: { value }, row: { original } }) => {

                            const { formattedDate, formattedDateHora, dateClass } = checkDateStatus(original.data_validade);

                            return (
                                <span to={`/editar-usuario/${original.id}`} className="d-flex flex-column align-items-start">
                                    <span className="font-weight-bold text-white mb-1">
                                        {original.usuario}
                                        <span className={`ms-1 badge fw-normal ${dateClass} hide-on-desktop`}>
                                            {formattedDate} {formattedDateHora}
                                        </span>
                                    </span>

                                    <div className="d-flex align-items-center me-1">
                                        {original.status === 0 ?
                                            <span className="badge bg-success">
                                                Ativo
                                            </span>
                                            :
                                            <span className="badge bg-danger">
                                                Bloqueado
                                            </span>
                                        }
                                        {original.tipo === 'teste' &&
                                            <span className="ms-1 badge bg-warning">
                                                Teste
                                            </span>
                                        }
                                        <div className='badge bg-dark text-max-15 ms-1'>{original.nome}</div>
                                        <div className={`badge bg-secondary ms-1 ${original.whatsapp ? '' : 'd-none'}`}>
                                            <Link className='text-dark' to={`http://wa.me/55${original.whatsapp.replace(/\D/g, '')}`} target='_blank'><i className="bi bi-whatsapp"></i>
                                                {original.whatsapp || '-'}
                                            </Link>
                                        </div>
                                    </div>
                                </span>
                            )
                        },
                    },
                    {
                        id: 'data_validade',
                        Header: () => (<div className='hide-on-mobile' style={{ textAlign: "center" }}>Validade</div>),
                        accessor: row => row.data_validade || '-',
                        isCentered: true,
                        Cell: ({ cell: { value }, row: { original } }) => {

                            const { formattedDate, formattedDateHora, dateClass } = checkDateStatus(value);

                            return (
                                <div className={`d-flex justify-content-center text-center align-items-center`}>
                                    <Link className={`${dateClass} hide-on-mobile`} to={`/editar-usuario/${original.id}`}>{formattedDate}<br /><span className="fs-7">{formattedDateHora}</span></Link>
                                </div>
                            )
                        }
                    },
                    {
                        Header: "Dono",
                        accessor: row => row.nome_dono || '-',
                        Cell: ({ cell: { value }, row: { original } }) => (
                            <Link to={`/editar-usuario/${original.id}`}>{value || '-'}
                                <div className="d-flex align-items-center lable-table bg-info-subtle text-info rounded border border-info-subtle font-text2 fw-bold">
                                    {original.servidor}
                                </div>
                            </Link>
                        ),
                    },
                    {
                        id: 'acoes',
                        Header: () => (<div style={{ textAlign: "center" }}>Ações</div>),
                        accessor: row => row.data_vencimento || '-',
                        Cell: ({ cell: { value }, row: { original } }) => {
                            return (
                                <div className="d-flex justify-content-center align-items-center">
                                    <Link className='fs-4 me-3' to={`/editar-usuario/${original.id}`}>
                                        <span className="material-symbols-outlined">
                                            edit
                                        </span>
                                    </Link>
                                    <Link className='fs-4 me-3' onClick={() => { setModalData({ nome: original.usuario, id: original.id, token: token }); setShowModalRenew(true); }} >
                                        <span className="material-symbols-outlined">
                                            calendar_add_on
                                        </span>
                                    </Link>
                                    <Link className="fs-4 me-3"
                                        onClick={() => {
                                            setModalData({ nome: original.nome, id: original.id });
                                            original.status === 1 ? setShowModalUnblock(true) : setShowModalBlock(true)
                                        }}
                                    >
                                        <span className="material-symbols-outlined">
                                            {original.status === 1 ? 'lock_open' : 'lock'}
                                        </span>
                                    </Link>
                                    <Link className='fs-4 me-3' onClick={() => { setModalData({ nome: original.usuario, id: original.id }); setShowModalDelete(true); }}>
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
                const response = await Api.get(`listar-usuarios/${idUsuario}`);
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
                <h6 className="text-uppercase">Lista de Usuários</h6>
                <hr />
                <div className='row'>
                    <div className="col-lg-12 mx-auto">
                        <div className="card">
                            <div className="card-header px-4 py-3 bg-transparent">
                                <h5 className="mb-0">Todos os usuários</h5>
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
                                <Table columns={columns} data={data} lenght={10} />
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
                    <Modal.Title>Bloquear Usuário</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Você tem certeza que deseja bloquear o usuário <b>{modalData.nome}</b>?
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
                    <Modal.Title>Desbloquear Usuário</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Você tem certeza que deseja desbloquear o usuário <b>{modalData.nome}</b>?
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

            {/* Modal de Renew */}
            <Modal centered show={showModalRenew} onHide={() => setShowModalRenew(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Renovar código por um mês</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Renovar o código <b>{modalData.nome}</b> por mais um mês?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => renovarUsuario(modalData.id, modalData.token)}>
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

export default ListarRenovacao;