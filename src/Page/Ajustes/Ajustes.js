import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Api from '../../Api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';



const Ajustes = () => {
    const [status, setStatus] = useState({ success: false, message: '' });
    const { idUsuario } = JSON.parse(localStorage.getItem("user_token"))
    const [dadosInfoUser, setDadosInfoUser] = useState(null);
    const [initialData, setInitialData] = useState(null);
    const navigate = useNavigate();
    const { token } = JSON.parse(localStorage.getItem("user_token"))

    const {
        register,
        handleSubmit,
        formState: { errors },
        control
    } = useForm();


    useEffect(() => {

        Api.get(`ajustes`).then((response) => {
            setInitialData(response.data[0]);
        });

        Api.get(`info/${idUsuario}`).then((response) => {
            setDadosInfoUser(response.data);
        });

    }, [idUsuario]);

    //Redireciona caso nao seja admin
    if (dadosInfoUser && dadosInfoUser.id_dono !== 0) {
        navigate("/")
        return null
    }

    const onSubmit = async (dados) => {
        console.log(dados);
        try {
            await Api.put(`ajustes-painel`, JSON.stringify(dados), {
                headers: { 'Content-Type': 'application/json' }
            });

            setStatus({
                success: true,
                message: "Ajustes do Painel editado com sucesso."
            });
        } catch (error) {
            console.error('Erro ao editar ajustes do painel:', error);
            const errorMessage = error.response?.data?.error || "Erro desconhecido ao editar ajustes do painel";
            setStatus({ success: false, message: errorMessage });
        }
    };

    if (!initialData) {
        return <div>Carregando...</div>;  // Ou algum componente de carregamento
    }

    return (

        <main className="page-content">
            <h6 className="text-uppercase">Ajustes do Painel</h6>
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
                                        Nome do Painel
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("titulo_painel", { required: true })} defaultValue={initialData.titulo_painel} />
                                        {errors.titulo_painel && <small>Nome do Painel é obrigatório.</small>}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Horas de Teste
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("hora_teste", { required: true })} defaultValue={initialData.hora_teste} type="number" />
                                        {errors.hora_teste && <small>Horas de teste é obrigatório.</small>}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Url da Logo
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("logo", { required: true })} defaultValue={initialData.logo} />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Url do Background
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("background", { required: true })} defaultValue={initialData.background} />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Exibir Usuários
                                    </label>
                                    <div className="col-sm-8">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" {...register("exibir_usuarios")} value="1" defaultChecked={initialData.exibir_usuarios === '1'} />
                                            <label className="form-check-label">Sim</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" {...register("exibir_usuarios")} value="0" defaultChecked={initialData.exibir_usuarios === '0'} />
                                            <label className="form-check-label">Não</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Exibir Códigos
                                    </label>
                                    <div className="col-sm-8">
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" {...register("exibir_codigos")} value="1" defaultChecked={initialData.exibir_codigos === '1'} />
                                            <label className="form-check-label">Sim</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" {...register("exibir_codigos")} value="0" defaultChecked={initialData.exibir_codigos === '0'} />
                                            <label className="form-check-label">Não</label>
                                        </div>
                                    </div>
                                </div>

                                <hr />
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Informativos
                                    </label>
                                    <div className="col-sm-8">
                                        <Controller
                                            name="informativo"
                                            control={control}
                                            defaultValue={initialData.informativo}
                                            render={({ field }) => (
                                                <ReactQuill
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            )}
                                        />
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

export default Ajustes;
