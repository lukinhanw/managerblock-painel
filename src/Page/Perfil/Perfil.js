import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Api from '../../Api';

const Perfil = () => {

    const [status, setStatus] = useState({ success: false, message: '' });
    const { token } = JSON.parse(localStorage.getItem("user_token"))

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Api.post(`perfil`, JSON.stringify({ 'token': token }), {
                    headers: { 'Content-Type': 'application/json' }
                });
                setInitialData(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [token]);

    const onSubmit = async (dados) => {
        try {
            await Api.put(`editar-perfil`, JSON.stringify(dados), {
                headers: { 'Content-Type': 'application/json' }
            });

            setStatus({
                success: true,
                message: "Perfil editado com sucesso."
            });

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

    if (!initialData) {
        return <div>Carregando...</div>;  // Ou algum componente de carregamento
    }

    return (

        <main className="page-content">
            <h6 className="text-uppercase">Editar Perfil</h6>
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
                                <input type="hidden" defaultValue={token} {...register("token", { required: true })} />
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Nome Completo *
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("nome", { required: true })} defaultValue={initialData.nome} />
                                        {errors.nome && <small>Nome completo é obrigatório.</small>}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Email *
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("email", { required: true })} defaultValue={initialData.email} type="email" />
                                        {errors.email && <small>Email de liberação é obrigatório.</small>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        WhatsApp
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("whatsapp")} defaultValue={initialData.whatsapp} type="text" />
                                        {errors.whatsapp && <small>Email é obrigatório.</small>}
                                    </div>
                                </div>

                                <hr />

                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Usuário do Painel *
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("usuario_painel")} defaultValue={initialData.usuario_painel} />
                                        {errors.usuario_painel && <small>Usuario do Painel é obrigatório.</small>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Senha do Painel *
                                    </label>
                                    <div className="col-sm-8">
                                        <input type="password" className="form-control" {...register("senha_painel")} defaultValue={initialData.senha_painel} />
                                        {errors.senha_painel && <small>Usuario do Painel é obrigatório.</small>}
                                    </div>
                                </div>
                                <div className="row mt-5">
                                    <label className="col-sm-4 col-form-label"></label>
                                    <div className="col-sm-8">
                                        <div className="d-md-flex d-grid align-items-center gap-3">
                                            <button className='btn btn-primary px-4' type="submit">Editar</button>
                                            <span className="btn btn-light px-4" onClick={() => window.history.back()}>Voltar</span>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Perfil;
