import React, { useEffect, useState } from 'react';

import Table from "../../Components/Table"
import { Link } from 'react-router-dom';
import Api from '../../Api';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { checkDateStatus } from '../../Components/Utils';


const ListarCodigos = () => {

    const [status, setStatus] = useState({ success: false, message: '' })
    const { idUsuario, token, renovacoes_autenticada } = JSON.parse(localStorage.getItem("user_token"))

    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalBlock, setShowModalBlock] = useState(false);
    const [showModalUnblock, setShowModalUnblock] = useState(false);
    const [showModalRenew, setShowModalRenew] = useState(false);
    const [showModalRenewAuthenticated, setShowModalRenewAuthenticated] = useState(false);
    const [showModalPagamentos, setShowModalPagamentos] = useState(false);

    const [selectedPlan, setSelectedPlan] = useState({ plano: '', valor: '' });
    const [paymentLink, setPaymentLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [qrCodeImageUrl, setQrCodeImageUrl] = useState('');
    const [pixCopiaCola, setPixCopiaCola] = useState('');

    const handleSubmitRenewToken = () => {
        setShowModalPagamentos(true)
        setShowModalRenewAuthenticated(false)
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Texto copiado para o clipboard!');
    };

    const sendToWhatsApp = () => {
        const message = `Aqui está o link para pagamento do plano ${selectedPlan.plano}: ${paymentLink}`;
        const whatsappUrl = `https://wa.me/${modalData.whatsapp}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const [modalData, setModalData] = useState({});

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
                        Header: "Código",
                        accessor: row => `${row.nome || '-'} ${row.codigo || ''} ${row.whatsapp || ''}`,
                        Cell: ({ cell: { value }, row: { original } }) => (
                            <Link to={`/editar-codigo/${original.id}`} className="d-flex flex-column align-items-start">
                                <span className="font-weight-bold text-white">{original.codigo}</span>

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
                                    <div className='badge bg-secondary ms-1'><Link className='text-dark' to={`http://wa.me/55${original.whatsapp.replace(/\D/g, '')}`} target='_blank'><i className="bi bi-whatsapp"></i> {original.whatsapp || '-'}</Link></div>
                                </div>
                            </Link>
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
                            const { formattedDate, formattedDateHora, dateClass } = checkDateStatus(value);
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
                                    <Link className='fs-4 me-3' onClick={() => { setModalData({ nome: original.codigo, id: original.id, token: token, username: original.codigo, whatsapp: original.whatsapp }); renovacoes_autenticada === "sim" ? setShowModalRenewAuthenticated(true) : setShowModalRenew(true); }} >
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
        [token, renovacoes_autenticada]
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

    const gerarLinkPagamento = async (plano, valor) => {
        setLoading(true);
        try {
            const response = await Api.post('/gerar-link-pagamento', { plano, valor });
            if (response.data.success) {
                setQrCodeImageUrl(response.data.qrCodeImageUrl);
                setPixCopiaCola(response.data.pixCopiaCola);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateLink = (plano, valor) => {
        setSelectedPlan({ plano, valor });
        gerarLinkPagamento(plano, valor);
    };

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

            {/* Modal de Renew Autenticada */}
            <Modal centered show={showModalRenewAuthenticated} onHide={() => setShowModalRenewAuthenticated(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Renovar código por um mês</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Para renovar o código <b>{modalData.nome}</b> , gere um link de pagamento.
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={handleSubmitRenewToken}
                    >
                        Gerar Link
                    </Button>
                    <Button variant="secondary" onClick={() => setShowModalRenewAuthenticated(false)}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Pagamentos */}
            <Modal centered show={showModalPagamentos} onHide={() => setShowModalPagamentos(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Gerar pagamento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Gerar link de pagamento para: <b>{modalData.nome}</b></p>
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" />
                        </div>
                    ) : qrCodeImageUrl && pixCopiaCola ? (
                        <div className="text-center">
                            <p>QR Code para pagamento:</p>
                            <img src={qrCodeImageUrl} className='img-fluid' width="250" alt="QR Code" />
                            <p className="mt-3">PIX Copia e Cola:</p>
                            <textarea className="form-control" readOnly value={pixCopiaCola} rows="3"></textarea>
                            <div className="mt-3">
                                <Button variant="primary" onClick={() => copyToClipboard(pixCopiaCola)}>Copiar PIX Copia e Cola</Button>
                                <Button variant="success" onClick={sendToWhatsApp} className="ms-2">Enviar via WhatsApp</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">1 mês</h5>
                                        <p className="card-text">Valor: R$ 10,00</p>
                                        <button className="btn btn-primary" onClick={() => handleGenerateLink('1 mês', 10)}>Gerar link</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">3 meses</h5>
                                        <p className="card-text">Valor: R$ 25,00</p>
                                        <button className="btn btn-primary" onClick={() => handleGenerateLink('3 meses', 25)}>Gerar link</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">6 meses</h5>
                                        <p className="card-text">Valor: R$ 50,00</p>
                                        <button className="btn btn-primary" onClick={() => handleGenerateLink('6 meses', 50)}>Gerar link</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">1 ano</h5>
                                        <p className="card-text">Valor: R$ 100,00</p>
                                        <button className="btn btn-primary" onClick={() => handleGenerateLink('1 ano', 100)}>Gerar link</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalPagamentos(false)}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        

        </>
    );
}

export default ListarCodigos;