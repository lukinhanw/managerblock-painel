import React from 'react';
import { useTable, usePagination, useGlobalFilter } from "react-table";

function Table({ columns, data, length = 10, showFilter = true, showMenu = true }) {

    // Adicione este estado no início do componente Table
    const [filter, setFilter] = React.useState("");
    const getValidityStatus = (row) => {
        const now = new Date();
        const validade = new Date(row.data_validade);
        if (row.status === "bloqueado") return "Bloqueados";
        if (row.tipo === "teste") return "Testes";
        if (validade < now) return "Expirados";
        return "Ativos";
    };

    // Filtrar os dados baseados no filtro selecionado antes de passá-los para useTable
    const filteredData = React.useMemo(() => {
        if (!filter || filter === "") {
            return data;
        } else {
            return data.filter(row => getValidityStatus(row) === filter);
        }
    }, [data, filter]);

    const props = useTable(
        {
            columns,
            data: filteredData,
            initialState: { pageSize: length }

        },
        useGlobalFilter,
        usePagination,

    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setGlobalFilter,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        // pageCount,
        // gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize, globalFilter }
    } = props;
    React.useEffect(() => {
    }, [globalFilter]);


    return (
        <>
            <div className="row">
                <div className={`col-md-3 ${showMenu ? '' : 'd-none'}`}>
                    <span className="col-md-3 position-relative float-end">
                        {/* <i className="bi bi-arrow-down-short position-absolute" style={{ right: '14px', top: '7px', fontSize: '1.6rem', color: '#adb5c9' }}></i> */}
                    </span>
                    <select className="form-select exibir_table mb-1 ps-4" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)) }}>
                        {[5, 10, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Exibir {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={`col-md-3 ${showMenu ? '' : 'd-none'}`}>
                    <span className="col-md-3 position-relative float-end">
                        {/* <i className="bi bi-arrow-down-short position-absolute" style={{ right: '14px', top: '7px', fontSize: '1.6rem', color: '#adb5c9' }}></i> */}
                    </span>
                    <div className="mb-3">
                        <select
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                            className="form-select exibir_table mb-1 ps-4"
                        >
                            <option value="">Todos</option>
                            <option value="Ativos">Ativos</option>
                            <option value="Expirados">Expirados</option>
                            <option value="Testes">Testes</option>
                            <option value="Bloqueados">Bloqueados</option>
                        </select>
                    </div>
                </div>
                <div className={`col-md-6 ${showFilter ? '' : 'd-none'}`}>
                    <span className="col-md-3 position-relative">
                        <i className="bi bi-search position-absolute" style={{ left: 6, top: 6, fontSize: '1.1rem', color: '#adb5c9' }}></i>
                    </span>
                    <input className="search_table float-end form-control" style={{ paddingLeft: 30 }} value={globalFilter || ""} onChange={e => setGlobalFilter(e.target.value)} type="search" placeholder="Pesquisar" aria-label="Search"></input>
                </div>
            </div>
            <div className="contact-list-area">
                <div className="container-fluid mb-3">
                    <div className="table-responsive w-100">
                        <table {...getTableProps()} className="table align-middle mb-1 text-nowrap">
                            <thead>
                                {headerGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column) => {
                                            return column.hideHeader === false ? null : (
                                                <th style={{ width: 250 }} {...column.getHeaderProps()} scope="col" className="px-6 py-3 text-xs font-bold text-gray-50 uppercase ">
                                                    <span className="inline-flex items-center">
                                                        {column.render("Header")}
                                                    </span>
                                                </th>
                                            );
                                        })}
                                    </tr>
                                ))}

                            </thead>
                            <tbody {...getTableBodyProps()}>
                                {page.map((row, i) => {
                                    prepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map(cell => {
                                                return (
                                                    <td {...cell.getCellProps()}>
                                                        {cell.render("Cell")}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}

                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='row mb-2'>
                    <div className='col-md-6 text-start'>Exibindo {pageSize < rows.length ? pageSize : rows.length} de {rows.length} registros</div>
                    <div className='col-md-6 text-end'>Página <strong>{pageIndex + 1} de {pageOptions.length}</strong></div>
                </div>

                <nav className='pagination_table'>
                    <ul className="pagination justify-content-end custom-style">
                        <li className="page-item">
                            <button onClick={() => previousPage()} disabled={!canPreviousPage} className="page-link">
                                <span className="material-symbols-outlined">
                                    chevron_left
                                </span>
                            </button>
                        </li>
                        <li className="page-item">
                            <button onClick={() => nextPage()} disabled={!canNextPage} className="page-link">
                                <span className="material-symbols-outlined">
                                    chevron_right
                                </span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

        </>
    );
}


export default Table;