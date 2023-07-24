import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';
import Api from "../../Api";
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NovoCodigo = () => {

    const { idUsuario, token } = JSON.parse(localStorage.getItem("user_token"))

    const [status, setStatus] = useState({ success: false, message: '' })
    const [showModalAdd, setShowModalAdd] = useState(false)
    const [modalData, setModalData] = useState({})

    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm();

    const [dadosInfoServidores, setDadosInfoServidores] = useState(null);
    useEffect(() => {
        Api.get(`servidores`).then((response) => {
            setDadosInfoServidores(response.data);
        });

    }, []);

    const onSubmit = async (dados) => {

        try {
            await Api.post('novo-codigo', JSON.stringify(dados), {
                headers: { 'Content-Type': 'application/json' }
            });

            setModalData({ usuario: dados.codigo, senha: dados.senha_liberacao })
            setStatus({
                success: true,
                message: "Código criado com sucesso."
            })
            setShowModalAdd(true)
            reset()
            setValue("whatsapp", "");

        } catch (error) {
            if (error.response) {
                setStatus({
                    success: false,
                    message: `Ocorreu um erro: ${error.response.data.error}`
                });

            } else if (error.request) {
                // O request foi feito mas não houve resposta
                console.log(error.request);
            } else {
                // Algo aconteceu na preparação do request que disparou um erro
                console.log('Error', error.message);
            }
        }
    };


    return (
        <main className="page-content">
            <h6 className="text-uppercase">Novo Código</h6>
            <hr />
            <div className='row'>
                <div className="col-lg-8 mx-auto">
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
                    <div className="card">
                        <div className="card-header px-4 py-3 bg-transparent">
                            <h5 className="mb-0">Prencha as informações</h5>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <input type="hidden" defaultValue={idUsuario} {...register("id_dono", { required: true })} />
                                <input type="hidden" defaultValue={token} {...register("token", { required: true })} />

                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Nome Completo *
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("nome", { required: true })} />
                                        {errors.nome && <small>Nome completo é obrigatório.</small>}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Usuário de Liberação *
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("codigo", { required: true })} type="text" />
                                        {errors.codigo && <small>Código de liberação é obrigatório.</small>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Senha de Liberação *
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("senha_liberacao", { required: true })} type="text" />
                                        {errors.senha_liberacao && <small>Senha de liberação é obrigatório.</small>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        E-mail
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("email")} type="email" />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        WhatsApp
                                    </label>
                                    <div className="col-sm-8">
                                        <InputMask mask="+99 99 99999 9999" className="form-control" maskChar=" " {...register("whatsapp")} />
                                        {errors.whatsapp && <small>Whatsapp é obrigatório.</small>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Quantidade de Créditos *
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("creditos", { required: true })} type="number" />
                                        {errors.creditos && <small>Quantidade de créditos é obrigatória.</small>}
                                    </div>
                                </div>
                                <hr />
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Selecione o Servidor *
                                    </label>
                                    <div className="col-sm-8">
                                        <select className="form-control" {...register("servidor", { required: true })}>
                                            <option value="">Selecione...</option>
                                            {dadosInfoServidores && dadosInfoServidores.map(item => (
                                                <option key={item.nome} value={item.nome}>{item.nome}</option>
                                            ))}
                                        </select>
                                        {errors.servidor && <small>Seleção de servidor é obrigatória.</small>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Usuario do Servidor *
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("usuario_servidor")} />
                                        {errors.usuario_servidor && <small>Usuário do Servidor é obrigatório.</small>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Senha do Servidor *
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("senha_servidor")} />
                                        {errors.senha_servidor && <small>Usuário do Senha é obrigatório.</small>}
                                    </div>
                                </div>
                                <div className="row mt-5">
                                    <label className="col-sm-4 col-form-label"></label>
                                    <div className="col-sm-8">
                                        <div className="d-md-flex d-grid align-items-center gap-3">
                                            <button className='btn btn-primary px-4' type="submit">Enviar</button>
                                            <button className="btn btn-light px-4" onClick={() => navigate("/dashboard")}>Voltar</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Modal centered show={showModalAdd} onHide={() => setShowModalAdd(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmação</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Código de liberação criado com sucesso.</p>
                    <p>Dados de acesso</p>
                    <p>Usuario: {modalData.usuario}</p>
                    <p>senha: {modalData.senha}</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => { setShowModalAdd(false) }} >
                        Fechar
                    </button>
                </Modal.Footer>
            </Modal>
        </main>
    );
}

export default NovoCodigo;
