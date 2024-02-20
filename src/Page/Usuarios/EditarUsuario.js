import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Api from '../../Api';
import { useNavigate, useParams } from 'react-router-dom';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import ptBR from 'date-fns/locale/pt-BR';

registerLocale('pt-BR', ptBR);

const EditarUsuario = () => {

    const { id } = useParams();
    const [status, setStatus] = useState({ success: false, message: '' });
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);
    const [dadosInfoUser, setDadosInfoUser] = useState(null);
    const { idUsuario } = JSON.parse(localStorage.getItem("user_token"))

    const { token } = JSON.parse(localStorage.getItem("user_token"))

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm();

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await Api.post(`usuario/${id}`, JSON.stringify({ 'token': token }), {
                    headers: { 'Content-Type': 'application/json' }
                });
                setInitialData(response.data);
            } catch (error) {
                navigate("/");
            }
        };

        Api.get(`info/${idUsuario}`).then((response) => {
            setDadosInfoUser(response.data);
        });

        fetchData();
    }, [id, token, navigate, idUsuario]);

    const [dadosInfoServidores, setDadosInfoServidores] = useState(null);
    useEffect(() => {
        Api.get(`servidores`).then((response) => {
            setDadosInfoServidores(response.data);
        });

    }, []);

    const onSubmit = async (dados) => {
        try {
            await Api.put(`editar-usuario/${id}`, JSON.stringify(dados), {
                headers: { 'Content-Type': 'application/json' }
            });
            setStatus({ success: true, message: "Usuário editado com sucesso." });
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Erro ao editar usuário:', error);
            const errorMessage = error.response?.data?.error || error.message || "Erro desconhecido";
            setStatus({ success: false, message: `Ocorreu um erro: ${errorMessage}` });
        }
    };

    if (!initialData) {
        return <div>Carregando...</div>;  // Ou algum componente de carregamento
    }

    return (

        <main className="page-content">
            <h6 className="text-uppercase">Editar Usuário</h6>
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
                                        Usuário *
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("usuario", { required: true })} defaultValue={initialData.usuario} type="text" />
                                        {errors.usuario && <small>Usuário é obrigatório.</small>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Senha *
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("senha", { required: true })} defaultValue={initialData.senha} type="text" />
                                        {errors.senha && <small>Senha é obrigatório.</small>}
                                    </div>
                                </div>

                                {dadosInfoUser && dadosInfoUser.id_dono === 0 && (
                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">
                                            Data de Validade
                                        </label>
                                        <div className="col-sm-8">
                                            <Controller
                                                name="data_validade"
                                                control={control}
                                                defaultValue={initialData ? new Date(initialData.data_validade) : new Date()}
                                                render={({ field }) => (
                                                    <ReactDatePicker
                                                        className="form-control"
                                                        dateFormat="dd/MM/yyyy HH:mm"
                                                        showTimeSelect
                                                        timeFormat="HH:mm"
                                                        timeIntervals={15}
                                                        onChange={(date) => field.onChange(date)}
                                                        selected={field.value}
                                                        locale="pt-BR"
                                                    />
                                                )}
                                            />
                                            {errors.data_validade && <small>Data de validade é obrigatório.</small>}
                                        </div>
                                    </div>
                                )}

                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        E-mail
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("email")} defaultValue={initialData.email} type="email" />
                                        {errors.email && <small>Email é obrigatório.</small>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        WhatsApp
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" type='number' {...register("whatsapp")} defaultValue={initialData.whatsapp} />
                                        {errors.whatsapp && <small>Whatsapp é obrigatório.</small>}
                                    </div>
                                </div>
                                <hr />
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Selecione o Servidor
                                    </label>
                                    <div className="col-sm-8">
                                        <select
                                            className="form-control"
                                            {...register("servidor", { required: true })}
                                            defaultValue={initialData.servidor}
                                        >
                                            <option value="">Selecione...</option>
                                            {dadosInfoServidores && dadosInfoServidores.map(item => (
                                                <option key={item.nome} value={item.nome}>{item.nome}</option>
                                            ))}
                                        </select>
                                        {errors.servidor && <small>Seleção de servidor é obrigatória.</small>}
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

export default EditarUsuario;
