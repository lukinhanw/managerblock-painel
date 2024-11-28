import React, { useMemo, useState } from 'react';
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { Link } from "react-router-dom";

function Table({ columns, data = [], length = 10, showFilter = true, showMenu = true, showPendingFilter = false, showPagamentosFilter = false, serverFilter, expirationFilter, statusFilter, ownerFilter }) {
    const [pendingFilter, setPendingFilter] = useState('todos');
    const [pagamentosFilter, setPagamentosFilter] = useState('todos');

    const filteredData = useMemo(() => {
        let filtered = data;

        if (serverFilter) {
            filtered = filtered.filter(item => item.servidor === serverFilter);
        }

        if (pendingFilter === 'pendentes') {
            filtered = filtered.filter(item => item.renovado_origem === 1);
        }

        if (pagamentosFilter !== 'todos') {
            filtered = filtered.filter(item => item.PB_status === pagamentosFilter);
        }

        if (statusFilter !== 'todos') {
            filtered = filtered.filter(item => item.status === parseInt(statusFilter));
        }

        if (ownerFilter) {
            filtered = filtered.filter(item => item.nome_dono === ownerFilter);
        }

        if (expirationFilter !== 'todos') {
            const currentDate = new Date();
            filtered = filtered.filter(item => {
                if (!item.data_validade) return false;
                const validadeDate = new Date(item.data_validade);
                const diffDays = Math.ceil((validadeDate - currentDate) / (1000 * 60 * 60 * 24));

                switch (expirationFilter) {
                    case 'expirados':
                        return diffDays < 0;
                    case '3dias':
                        return diffDays >= 0 && diffDays <= 3;
                    case '7dias':
                        return diffDays > 3 && diffDays <= 7;
                    default:
                        return true;
                }
            });
        }

        return filtered;
    }, [data, pendingFilter, pagamentosFilter, serverFilter, expirationFilter, statusFilter, ownerFilter]);

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
                    <select className="form-select exibir_table mb-1 ps-4" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)) }}>
                        {[5, 10, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Exibir {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                {showPendingFilter && (
                    <div className="col-md-2">
                        <select
                            className="form-select mb-1 ps-4"
                            value={pendingFilter}
                            onChange={e => setPendingFilter(e.target.value)}
                        >
                            <option value="todos">Todos</option>
                            <option value="pendentes">Pendentes</option>
                        </select>
                    </div>
                )}
                {showPagamentosFilter && (
                    <div className="col-md-2">
                        <select
                            className="form-select mb-1 ps-4"
                            value={pagamentosFilter}
                            onChange={e => setPagamentosFilter(e.target.value)}
                        >
                            <option value="todos">Todos</option>
                            <option value="approved">Aprovados</option>
                            <option value="pending">Pendentes</option>
                            <option value="cancelled">Cancelados</option>
                        </select>
                    </div>
                )}
                <div className={`col-md-4 ${showPendingFilter || showPagamentosFilter ? 'offset-md-3' : 'offset-md-5'} ${showFilter ? '' : 'd-none'}`}>
                    <span className="col-md-3 position-relative">
                        <i className="bi bi-search position-absolute" style={{ left: 6, top: 6, fontSize: '1.1rem', color: '#adb5c9' }}></i>
                    </span>
                    <input className="search_table float-end form-control" style={{ paddingLeft: 30 }} value={globalFilter || ""} onChange={e => setGlobalFilter(e.target.value)} type="search" placeholder="Pesquisar" aria-label="Search"></input>
                </div>
            </div>
            <div className="contact-list-area">
                <div className="container-fluid mb-3">
                    <div className="table-responsive w-100">
                        <table {...getTableProps()} className="table align-middle mb-1 mt-4 text-nowrap">
                            <thead>
                                {headerGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column) => {
                                            return column.hideHeader === false ? null : (
                                                <th {...column.getHeaderProps()} scope="col" className="px-6 py-3 text-xs font-bold text-gray-50 uppercase ">
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
                            <Link onClick={() => previousPage()} disabled={!canPreviousPage} className="page-link" to="#">
                                <span className="material-symbols-outlined">
                                    chevron_left
                                </span>
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link onClick={() => nextPage()} disabled={!canNextPage} className="page-link" to="#">
                                <span className="material-symbols-outlined">
                                    chevron_right
                                </span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}

export default Table;