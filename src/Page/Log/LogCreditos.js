import React, { useEffect, useState } from 'react';
import Api from '../../Api';
import Table from "../../Components/Table"


const LogCreditos = () => {

    const { token } = JSON.parse(localStorage.getItem("user_token"))

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
                        accessor: row => row.id || '-'
                    },
                    {
                        Header: "Tipo",
                        accessor: row => row.tipo || '-',
                        Cell: ({ cell: { value }, row: { original } }) => (
                            <div>
                                <span className="badge rounded-pill bg-primary">{value}</span>
                            </div>
                        ),
                    },
                    {
                        Header: "Detalhes",
                        accessor: row => row.detalhes || '-',
                        Cell: ({ cell: { value }, row: { original } }) => (
                            <div>
                                {value}
                            </div>
                        ),
                    },
                    {
                        Header: "Data",
                        accessor: row => row.data || '-',
                        Cell: ({ cell: { value }, row: { original } }) => (
                            <div>
                                {value}
                            </div>
                        ),
                    },
                ]
            }
        ],
        []
    );

    const [data, setData] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await Api.post(`logs-creditos`, JSON.stringify({'token': token}), {
                    headers: { 'Content-Type': 'application/json' }
                });
                setData(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [token]);

    return (
        <>
            <main className="page-content">
                <h6 className="text-uppercase">Logs de Créditos</h6>
                <hr />
                <div className='row'>
                    <div className="col-lg-12 mx-auto">
                        <div className="card">
                            <div className="card-header px-4 py-3 bg-transparent">
                                <h5 className="mb-0">Todos os registros de logs de créditos</h5>
                            </div>
                            <div className='card-body p-4'>
                                <Table columns={columns} data={data} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default LogCreditos;