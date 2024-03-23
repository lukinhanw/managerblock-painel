import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Api from '../../Api';
import { useParams } from 'react-router-dom';

const EditarTeste = () => {

    const { id } = useParams();
    const [status, setStatus] = useState({ success: false, message: '' });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        Api.get(`codigo.php?id=${id}`).then((response) => {
            setInitialData(response.data);
        });
    }, [id]);


    const onSubmit = async (data) => {
        try {
            console.log(data);

            setStatus({
                success: false,
                message: "Ocorreu um erro ao atualizar o cliente. Por favor, tente novamente mais tarde."
            });
        } catch (error) {
            alert('Erro na comunicação com a API.');
        }
    };

    if (!initialData) {
        return <div>Carregando...</div>;  // Ou algum componente de carregamento
    }

    return (

        <main className="page-content">
            <h6 className="text-uppercase">Editar Teste</h6>
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
                                <div className="row mb-3">
                                    <label className="col-sm-3 col-form-label">
                                        Nome Completo*
                                    </label>
                                    <div className="col-sm-9">
                                        <input className="form-control" {...register("nome", { required: true })} defaultValue={initialData.nome_completo} />
                                        {errors.nome && <small>Nome completo é obrigatório.</small>}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label className="col-sm-3 col-form-label">
                                        Código de Liberação *
                                    </label>
                                    <div className="col-sm-9">
                                        <input className="form-control" {...register("codigo", { required: true })} defaultValue={initialData.codigo} type="number" />
                                        {errors.codigo && <small>Código de liberação é obrigatório.</small>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-sm-3 col-form-label">
                                        E-mail
                                    </label>
                                    <div className="col-sm-9">
                                        <input className="form-control" {...register("email")} defaultValue={initialData.email} type="email" />
                                        {errors.email && <small>Email é obrigatório.</small>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-sm-3 col-form-label">
                                        WhatsApp
                                    </label>
                                    <div className="col-sm-9">
                                        <input className="form-control" {...register("whatsapp")} defaultValue={initialData.whatsapp} />
                                        {errors.whatsapp && <small>Whatsapp é obrigatório.</small>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-sm-3 col-form-label">
                                        Selecione o Servidor
                                    </label>
                                    <div className="col-sm-9">
                                        <select
                                            className="form-control"
                                            {...register("servidor", { required: true })}
                                            defaultValue={initialData.servidor}
                                        >
                                            <option value="">Selecione...</option>
                                            <option value="Five">Five</option>
                                            <option value="P2Cine">P2Cine</option>
                                        </select>
                                        {errors.servidor && <small>Seleção de servidor é obrigatória.</small>}
                                    </div>
                                </div>
                                <hr />
                                <div className="row mb-3">
                                    <label className="col-sm-3 col-form-label">
                                        Usuario do Servidor *
                                    </label>
                                    <div className="col-sm-9">
                                        <input className="form-control" {...register("usuario_servidor")} defaultValue={initialData.usuario_servidor} />
                                        {errors.usuario_servidor && <small>Usuário do Servidor é obrigatório.</small>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-sm-3 col-form-label">
                                        Senha do Servidor *
                                    </label>
                                    <div className="col-sm-9">
                                        <input className="form-control" {...register("senha_servidor")} defaultValue={initialData.senha_servidor} />
                                        {errors.senha_servidor && <small>Usuário do Senha é obrigatório.</small>}
                                    </div>
                                </div>
                                <div className="row mt-5">
                                    <label className="col-sm-3 col-form-label"></label>
                                    <div className="col-sm-9">
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

export default EditarTeste;
