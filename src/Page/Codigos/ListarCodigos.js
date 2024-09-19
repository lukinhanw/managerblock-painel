import React, { useEffect, useState, useContext } from 'react';
import { differenceInDays, format, parseISO } from 'date-fns';
import Table from "../../Components/Table"
import { Link } from 'react-router-dom';
import Api from '../../Api';
import { Button, Modal } from 'react-bootstrap';
import { NotificationContext } from '../../NotificationContext';

const ListarCodigos = () => {
    const { verificarNotificacoes } = useContext(NotificationContext);
    const [status, setStatus] = useState({ success: false, message: '' })
    const { idUsuario, token } = JSON.parse(localStorage.getItem("user_token"))
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalBlock, setShowModalBlock] = useState(false);
    const [showModalUnblock, setShowModalUnblock] = useState(false);
    const [showModalRenew, setShowModalRenew] = useState(false);
    const [showModalRenewAuth, setShowModalRenewAuth] = useState(false);
    const [pixData, setPixData] = useState({ copiaECola: '', qrCodeBase64: '' });
    const [selectedRenewalOption, setSelectedRenewalOption] = useState('');
    const [planos, setPlanos] = useState([]);
    const [modalData, setModalData] = useState({});
    const [showModalNotification, setShowModalNotification] = useState(false);
    const [notificationData, setNotificationData] = useState({});

    // Obter planos
    useEffect(() => {
        const obterPlanos = async () => {
            try {
                const response = await Api.get('obter-planos');
                setPlanos(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        obterPlanos();
    }, []);

    const renovarCodigo = async (id, token) => {
        try {
            const response = await Api.put(`renovar-codigo/${id}`, JSON.stringify({ token }), {
                headers: { 'Content-Type': 'application/json' }
            });

            setShowModalRenew(false);
            if (response.data.success === true) {
                setStatus(response.data);
            }
        } catch (error) {
            console.log(error);
            setStatus({
                success: false,
                message: error.response.data.error,
            });
        }
    };

    const renovarCodigoAuth = async (id, token) => {
        setSelectedRenewalOption(false);
        try {
            const response = await Api.post(`gerar-pix-pagamento/${id}`, JSON.stringify({ token, plano: selectedRenewalOption }), {
                headers: { 'Content-Type': 'application/json' }
            });

            setPixData({
                copiaECola: response.data.pix_copia_e_cola,
                qrCodeBase64: response.data.pix_qr_code_url
            });
            setStatus(response.data.message);
            setShowModalRenewAuth(false);
            verificarNotificacoes();

        } catch (error) {
            console.log(error.response.data.message);
            setStatus({
                success: false,
                message: error.response.data.message,
            });
            setShowModalRenewAuth(false);
        }
    };

    const deletarCodigo = async (id) => {
        try {
            const response = await Api.delete(`deletar-codigo/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setShowModalDelete(false);
            if (response.data.success === true) {
                setStatus(response.data);
            }
        } catch (error) {
            console.log(error);
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

    const handleNotificationClick = (codigo) => {
        setNotificationData(codigo);
        setShowModalNotification(true);
    };

    const handleNotificationConfirm = async (confirmed) => {
        try {
            const response = await Api.put(`atualizar-renovado-origem/${notificationData.id}`, JSON.stringify({ confirmado: confirmed, token: token }), {
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.data.success === true) {
                setStatus(response.data);
            }
        } catch (error) {
            console.error(error);
            setStatus({
                success: false,
                message: "Ocorreu um erro ao atualizar a renovação. Tente novamente mais tarde.",
            });
        }
        setShowModalNotification(false);
        verificarNotificacoes(); // Atualiza o estado das notificações no header
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
                        accessor: row => row.id || '-',
                    },
                    {
                        Header: "Código",
                        accessor: row => `${row.nome || '-'} ${row.codigo || ''} ${row.whatsapp || ''}`,
                        Cell: ({ cell: { value }, row: { original } }) => (
                            <div to={`/editar-codigo/${original.id}`} className="fs-6 d-flex flex-column align-items-start">
                                <div className="d-flex align-items-center">
                                    {original.renovado_origem === 1 && (
                                        <i className="bi bi-bell-fill text-warning me-2 blink cursor-pointer" onClick={() => handleNotificationClick(original)}></i>
                                    )}
                                    <span className="font-weight-bold text-white">{original.codigo}</span>
                                </div>

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
                                    <div className='badge bg-dark text-max-15 ms-1'>{original.nome}</div>
                                    <div className='badge bg-secondary ms-1'><Link className='text-dark' to={`http://wa.me/55${original.whatsapp}`} target='_blank'><i className="bi bi-whatsapp"></i> {original.whatsapp || '-'}</Link></div>
                                </div>
                            </div>
                        ),
                    },
                    {
                        id: 'data_validade',
                        Header: () => (
                            <div
                                style={{
                                    textAlign: "center",
                                }}
                            >Validade</div>
                        ),
                        accessor: row => row.data_validade || '-',
                        Cell: ({ cell: { value }, row: { original } }) => {
                            let formattedDate = value;
                            let formattedDateHora = '';
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
                                    formattedDate = format(dateObj, 'dd-MM-yyyy');
                                    formattedDateHora = format(dateObj, 'HH:ii');
                                } else if (daysDifference <= 7) {
                                    dateClass = "text-warning";
                                    formattedDate = format(dateObj, 'dd-MM-yyyy');
                                    formattedDateHora = format(dateObj, 'HH:ii');
                                } else {
                                    formattedDate = format(dateObj, 'dd-MM-yyyy');
                                    formattedDateHora = format(dateObj, 'HH:ii');
                                }

                            }

                            return (
                                <div className={`d-flex justify-content-center text-center align-items-center`}>
                                    <Link className={dateClass} to={`/editar-codigo/${original.id}`}>{formattedDate}<br /><span className="fs-7">{formattedDateHora}</span></Link>
                                </div>
                            )
                        }
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
                            <Link to={`/editar-codigo/${original.id}`}>{value || '-'}
                                <div className="d-flex align-items-center lable-table bg-info-subtle text-info rounded border border-info-subtle font-text2 fw-bold">
                                    {original.servidor}
                                </div>
                            </Link>
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
                                <div className="d-flex justify-content-center align-items-center">
                                    <Link className='fs-4 me-3' to={`/editar-codigo/${original.id}`}>
                                        <span className="material-symbols-outlined">
                                            edit
                                        </span>
                                    </Link>
                                    <Link className='fs-4 me-3' onClick={() => { setModalData({ nome: original.codigo, id: original.id, token: token }); original.renovacoes_automaticas ? setShowModalRenewAuth(true) : setShowModalRenew(true); }} >
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
                                    <Link className='fs-4 me-3' onClick={() => { setModalData({ nome: original.codigo, id: original.id }); setShowModalDelete(true); }}>
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
                console.log(response.data);
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
                                {data && data.length > 0 && <Table columns={columns} data={data} lenght={10} showPendingFilter={true} />}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal de pagamento via Pix */}
            <Modal centered show={pixData.copiaECola !== ''} onHide={() => setPixData({ copiaECola: '', qrCodeBase64: '' })}>
                <Modal.Header closeButton>
                    <Modal.Title>Pagamento via Pix</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <p>Código Pix Copia e Cola:</p>
                        <input type="text" className="form-control" value={pixData.copiaECola} readOnly />
                    </div>
                    <div className="mt-4 text-center">
                        <img className='w-50' src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code Pix" />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setPixData({ copiaECola: '', qrCodeBase64: '' })}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>

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

            {/* Modal de Renew Automáticas */}
            <Modal centered show={showModalRenewAuth} onHide={() => { setShowModalRenewAuth(false); setSelectedRenewalOption(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Renovar código {modalData.nome}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Dropdown com 3 opcoes */}
                    <select
                        className="form-select"
                        aria-label="Selecione Renovacoes Automáticas"
                        value={selectedRenewalOption}
                        onChange={(e) => setSelectedRenewalOption(e.target.value)}
                    >
                        <option value="">Selecione uma opção</option>
                        {planos.map(plano => (
                            <option key={plano.id} value={plano.id}>
                                Renovar por {plano.meses} mês(es) - R$ {Number(plano.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </option>
                        ))}
                    </select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" disabled={!selectedRenewalOption} onClick={() => renovarCodigoAuth(modalData.id, modalData.token)}>
                        Gerar link de pagamento
                    </Button>
                    <Button variant="secondary" onClick={() => { setShowModalRenewAuth(false); setSelectedRenewalOption(false) }}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Notificação */}
            <Modal centered show={showModalNotification} onHide={() => setShowModalNotification(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmação de Renovação</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Você fez a renovação do usuário <b>{notificationData.nome}</b> no servidor de origem?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => handleNotificationConfirm(true)}>
                        Sim
                    </Button>
                    <Button variant="secondary" onClick={() => setShowModalNotification(false)}>
                        Não
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ListarCodigos;
