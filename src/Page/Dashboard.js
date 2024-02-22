import React, { useCallback, useEffect, useState } from 'react';
import Api from '../Api';
import { Link } from 'react-router-dom';
import Table from '../Components/Table';
import { Button, Modal } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { checkDateStatus } from '../Components/Utils';

const Dashboard = () => {

    const [status, setStatus] = useState({ success: false, message: '' })
    const [dadosAjustes, setDadosAjustes] = useState(null);
    const [dadosInfoUser, setDadosInfoUser] = useState(null);
    const { idUsuario, token } = JSON.parse(localStorage.getItem("user_token"))
    const [modalData, setModalData] = useState({})
    const [showModalRenew, setShowModalRenew] = useState(false);

    // Registrando os componentes necessários do Chart.js
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

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
                        id: 'Codigo',
                        accessor: row => row.codigo || '-',
                        Header: () => (<div className='hide-on-mobile' style={{ textAlign: "left" }}>Código</div>),
                        Cell: ({ cell: { value }, row: { original } }) => {

                            const { formattedDate, formattedDateHora, dateClass } = checkDateStatus(original.data_validade);

                            return (
                                <>
                                    <div className="d-flex mb-1">
                                        <Link className='ps-2' to={`/editar-codigo/${original.id}`}>{value}</Link>
                                        {original.tipo === 'teste' &&
                                            <span className="ms-1 badge bg-warning">
                                                Teste
                                            </span>
                                        }
                                        {/* <span className={`badge bg-info hide-on-desktop me-2`}>{original.servidor}</span> */}
                                    </div>
                                    <div className="d-flex">
                                        <span className={`badge ${dateClass} hide-on-desktop me-2`}> {formattedDate} {formattedDateHora} </span>
                                        <span className={`badge bg-dark hide-on-desktop fs-7`}>{original.nome_dono}</span>
                                    </div>
                                </>
                            )
                        },
                    },
                    {
                        id: 'data_validade',
                        Header: () => (<div className='hide-on-mobile' style={{ textAlign: "center" }}>Validade</div>),
                        accessor: row => row.data_validade || '-',
                        Cell: ({ cell: { value }, row: { original } }) => {

                            const { formattedDate, formattedDateHora, dateClass } = checkDateStatus(value);

                            return (
                                <div className={`d-flex justify-content-center text-center align-items-center`}>
                                    <Link className={`${dateClass} hide-on-mobile`} to={`/editar-codigo/${original.id}`}>{formattedDate}<br /><span className="fs-7">{formattedDateHora}</span></Link>
                                    <Link className='hide-on-desktop fs-4' style={{ paddingTop: 5 }} onClick={() => { setModalData({ nome: original.codigo, id: original.id, token: token }); setShowModalRenew(true); }} >
                                        <span className="material-symbols-outlined">
                                            calendar_add_on
                                        </span>
                                    </Link>
                                </div>
                            )
                        }
                    },
                    {
                        id: 'servidor',
                        Header: () => (<div className='hide-on-mobile' style={{ textAlign: "left" }}>Servidor</div>),
                        accessor: row => row.servidor || '-',
                        Cell: ({ cell: { value }, row: { original } }) => (
                            <Link className='hide-on-mobile' to={`/editar-codigo/${original.id}`}>{value || '-'}</Link>
                        ),
                    },
                    {
                        id: 'nome_dono',
                        Header: () => (<div className='hide-on-mobile' style={{ textAlign: "left" }}>Dono</div>),
                        accessor: row => row.nome_dono || '-',
                        Cell: ({ cell: { value }, row: { original } }) => (
                            <Link className='hide-on-mobile' to={`/editar-codigo/${original.id}`}>{value || '-'}</Link>
                        ),
                    },
                    {
                        id: 'acoes',
                        Header: () => (<div className='hide-on-mobile' style={{ textAlign: "center" }}>Renovar</div>),
                        accessor: row => row.data_vencimento || '-',
                        Cell: ({ cell: { value }, row: { original } }) => {
                            return (
                                <div className="d-flex justify-content-center">
                                    <Link className='hide-on-mobile fs-4' onClick={() => { setModalData({ nome: original.codigo, id: original.id, token: token }); setShowModalRenew(true); }} >
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
                    backgroundColor: 'rgba(0, 123, 255, 0.5)',
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
                type: 'category'
            },
            y: {
                type: 'linear'
            }
        }
    };


    return (
        <main className="page-content">
            <h6 className="text-uppercase">Dashboard</h6>
            <hr />
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-xl-4 row-cols-xxl-4">
                <div className="col">
                    <div className="card radius-10 bg-info border-4">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="">
                                    <p className="mb-1 fs-7 text-dark">Códigos / Usuários</p>
                                    <h4 className="mb-0 text-dark">{(dadosInfoUser && dadosInfoUser.quantidade_codigos) || '0'}</h4>
                                </div>
                                <div className="ms-auto widget-icon bg-dark text-white">
                                    <span className="material-symbols-outlined"> password </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card radius-10 bg-secondary">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="">
                                    <p className="mb-1 fs-7 text-dark">Testes</p>
                                    <h4 className="mb-0 text-dark">{(dadosInfoUser && dadosInfoUser.quantidade_testes) || '0'}</h4>
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
                    <div className="card radius-10 bg-warning">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="">
                                    <p className="mb-1 fs-7 text-dark">Revendedores</p>
                                    <h4 className="mb-0 text-dark">{(dadosInfoUser && dadosInfoUser.quantidade_revendedores) || '0'}</h4>
                                </div>
                                <div className="ms-auto widget-icon bg-light text-white">
                                    <span className="material-symbols-outlined">
                                        group
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card radius-10 bg-success">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="">
                                    <p className="mb-1 fs-7 text-dark">Créditos</p>
                                    <h4 className="mb-0 text-dark">{(dadosInfoUser && dadosInfoUser.creditos) || '0'}</h4>
                                </div>
                                <div className="ms-auto widget-icon bg-light text-white">
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
                <div className="col-12 col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col">
                                    <h5 className="mb-0 fs-6">Avisos</h5>
                                </div>
                            </div>
                        </div>
                        <div className="card-body" style={{ height: 350, overflow: 'auto' }}>
                            <div dangerouslySetInnerHTML={{ __html: (dadosAjustes && dadosAjustes.informativo) }}></div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col">
                                    <h5 className="mb-0 fs-6">Novos Usuários</h5>
                                </div>
                            </div>
                        </div>
                        <div className="card-body" style={{ height: 350, overflow: 'auto' }}>
                            {chartData.datasets.length > 0 && <Bar data={chartData} options={options} />}
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col">
                                    <h5 className="mb-0 fs-6">Códigos / Usuários vencendo</h5>
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