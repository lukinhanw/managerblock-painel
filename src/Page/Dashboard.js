import React, { useCallback, useEffect, useState } from 'react';
import Api from '../Api';
import { Link } from 'react-router-dom';
import Table from '../Components/Table';
import { differenceInDays, format, parseISO } from 'date-fns';
import { Button, Modal } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

const Dashboard = () => {
    // Registrando os componentes necessários do Chart.js
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

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

    const columnsCodigos = React.useMemo(
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

    const getUsuariosNovos = useCallback(async () => {
        try {
            const response = await Api.get(`/listar-usuarios-intervalo/${idUsuario}`);
            let data = response.data;
    
            let intervalos = {
                hoje: 0,
                ontem: 0,
                ultima_semana: 0,
                este_mes: 0,
                mes_passado: 0
            };
    
            // Processamento dos dados
            data.forEach(item => {
                if (intervalos.hasOwnProperty(item.intervalo)) {
                    intervalos[item.intervalo] = item.quantidade;
                }
            });
    
            // Mapeando os intervalos para rótulos legíveis
            const labelsLegiveis = {
                hoje: 'Hoje',
                ontem: 'Ontem',
                ultima_semana: 'Última Semana',
                este_mes: 'Este Mês',
                mes_passado: 'Mês Passado'
            };
    
            setChartData({
                labels: Object.keys(intervalos).map(key => labelsLegiveis[key]),
                datasets: [{
                    label: 'Novos usuários',
                    data: Object.values(intervalos),
                    backgroundColor: 'rgba(255, 51, 102, 0.5)',
                    borderColor: 'rgba(255, 51, 102, 1)',
                    borderWidth: 1
                }]
            });
        } catch (error) {
            console.error('Erro ao buscar dados dos usuários', error);
        }
    }, [idUsuario]);
    

    useEffect(() => {
        getUsuariosNovos();
    }, [getUsuariosNovos]);

    // Opções para o gráfico
    const options = {
        scales: {
            x: {
                type: 'category',
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#bdc3c7'
                }
            },
            y: {
                type: 'linear',
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#bdc3c7'
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#ecf0f1'
                }
            }
        }
    };

    return (
        <main className="page-content">
            <h6 className="text-uppercase">Dashboard</h6>
            <hr />
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-xl-4 row-cols-xxl-4 mb-4">
                <div className="col">
                    <div className="modern-card">
                        <div className="card-content">
                            <div className="d-flex align-items-center">
                                <div>
                                    <p className="card-label">Códigos / Usuários</p>
                                    <h4 className="card-value">{(dadosInfoUser && dadosInfoUser.quantidade_codigos) || '0'}</h4>
                                </div>
                                <div className="card-icon primary-gradient">
                                    <span className="material-symbols-outlined">password</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="modern-card">
                        <div className="card-content">
                            <div className="d-flex align-items-center">
                                <div>
                                    <p className="card-label">Testes</p>
                                    <h4 className="card-value">{(dadosInfoUser && dadosInfoUser.quantidade_testes) || '0'}</h4>
                                </div>
                                <div className="card-icon secondary-gradient">
                                    <span className="material-symbols-outlined">edit_document</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="modern-card">
                        <div className="card-content">
                            <div className="d-flex align-items-center">
                                <div>
                                    <p className="card-label">Revendedores</p>
                                    <h4 className="card-value">{(dadosInfoUser && dadosInfoUser.quantidade_revendedores) || '0'}</h4>
                                </div>
                                <div className="card-icon purple-gradient">
                                    <span className="material-symbols-outlined">group</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="modern-card">
                        <div className="card-content">
                            <div className="d-flex align-items-center">
                                <div>
                                    <p className="card-label">Créditos</p>
                                    <h4 className="card-value">{(dadosInfoUser && dadosInfoUser.creditos) || '0'}</h4>
                                </div>
                                <div className="card-icon coral-gradient">
                                    <span className="material-symbols-outlined">monetization_on</span>
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
                <div className="col-6">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col">
                                    <h6 className="mb-0">Aviso</h6>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div dangerouslySetInnerHTML={{ __html: (dadosAjustes && dadosAjustes.informativo) }}></div>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col">
                                    <h6 className="mb-0">Novos Usuários</h6>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            {chartData.datasets.length > 0 && <Bar data={chartData} options={options} />}
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col">
                                    <h6 className="mb-0">Códigos / Usuários vencendo</h6>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <Table columns={columnsCodigos} data={data} showFilter={false} showMenu={false} />
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