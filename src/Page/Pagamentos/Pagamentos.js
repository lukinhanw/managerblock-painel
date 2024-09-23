import React, { useEffect, useState } from "react";
import Api from "../../Api";
import Table from "../../Components/Table";
import { formatarDate } from "../../Components/Utils";

const Pagamentos = () => {
	const { token } = JSON.parse(localStorage.getItem("user_token"));

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
						accessor: (row) => row.id || "-",
					},
					{
						Header: "Código",
						accessor: (row) => row.codigo_usuario || "-",
						Cell: ({ cell: { value }, row: { original } }) => (
							<div className="d-flex flex-column">
								<div>{value}</div>
								<div>
									<span className="badge bg-info">{original.nome_usuario}</span>
								</div>
							</div>
						),
					},
					{
						Header: "Data da Transição",
						accessor: (row) => row.data_pagamento || "-",
						Cell: ({ cell: { value }, row: { original } }) => {
							// Uso da função auxiliar no componente
							const date = new Date(value > 1 ? value : original.created_at);
							const formattedDate = formatarDate(date);

							return <div>{formattedDate}</div>;
						},
					},
					{
						Header: "Valor",
						accessor: (row) => row.valor || "-",
						Cell: ({ cell: { value }, row: { original } }) => {
							const formattedValue = new Intl.NumberFormat("pt-BR", {
								style: "currency",
								currency: "BRL",
							}).format(value);
							return <div>{formattedValue}</div>;
						},
					},
					{
						Header: "Plano",
						accessor: (row) => row.meses || "-",
						Cell: ({ cell: { value }, row: { original } }) => (
							<div>
								{value} {value === 1 ? "mês" : "meses"}
							</div>
						),
					},
					{
						Header: "Revendedor",
						accessor: (row) => row.nome_vendedor || "-",
						Cell: ({ cell: { value }, row: { original } }) => (
							<div>{value}</div>
						),
					},
					{
						Header: "Status",
						accessor: (row) => row.PB_status || "-",
						Cell: ({ cell: { value }, row: { original } }) => {
							let cor_status = "";
							let texto_status = "";

							switch (value) {
								case "approved":
									cor_status = "success";
									texto_status = "Pago";
									break;
								case "pending":
									cor_status = "warning";
									texto_status = "Aguardando Pagamento";
									break;
								case "inprocess":
									cor_status = "info";
									texto_status = "Em Processamento";
									break;
								case "inmediation":
									cor_status = "info";
									texto_status = "Em Mediação";
									break;
								case "rejected":
									cor_status = "danger";
									texto_status = "Negada";
									break;
								case "cancelled":
									cor_status = "secondary";
									texto_status = "Cancelado";
									break;
								case "refunded":
									cor_status = "info";
									texto_status = "Reembolsado";
									break;
								case "chargedback":
									cor_status = "dark";
									texto_status = "Estornado";
									break;
								default:
									cor_status = "dark";
									texto_status = "Desconhecido";
									break;
							}

							return (
								<div>
									<span className={`badge rounded-pill bg-${cor_status}`}>
										{texto_status}
									</span>
								</div>
							);
						},
					},
					{
						Header: "Mercado Pago ID",
						accessor: (row) => row.PB_checkout || "-",
						Cell: ({ cell: { value }, row: { original } }) => (
							<div>{value}</div>
						),
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
				const response = await Api.post(
					`obter-pagamentos`,
					JSON.stringify({ token: token }),
					{
						headers: { "Content-Type": "application/json" },
					}
				);
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
				<h6 className="text-uppercase">Pagamentos</h6>
				<hr />
				<div className="row">
					<div className="col-lg-12 mx-auto">
						<div className="card">
							<div className="card-header px-4 py-3 bg-transparent">
								<h5 className="mb-0">
									Todos os registros de pagamentos
								</h5>
							</div>
							<div className="card-body p-4">
								{data && data.length > 0 && <Table columns={columns} data={data} showPagamentosFilter={true} />}
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
};

export default Pagamentos;
