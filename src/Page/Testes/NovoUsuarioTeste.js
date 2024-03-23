import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Api from '../../Api';
import { IMaskInput } from 'react-imask';
import { useNavigate } from 'react-router-dom';

const NovoUsuarioTeste = () => {

    const [status, setStatus] = useState({ success: false, message: '' });

    const [dadosInfoUser, setDadosInfoUser] = useState(null);
    const { idUsuario, token } = JSON.parse(localStorage.getItem("user_token"))
    useEffect(() => {
        Api.get(`info/${idUsuario}`).then((response) => {
            setDadosInfoUser(response.data);
        });
    }, [idUsuario]);

    const [dadosInfoServidores, setDadosInfoServidores] = useState(null);
    useEffect(() => {
        Api.get(`servidores`).then((response) => {
            setDadosInfoServidores(response.data);
        });

    }, []);

    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm();

    const onSubmit = async (dados) => {
        try {
            await Api.post('novo-usuario-teste', JSON.stringify(dados), {
                headers: { 'Content-Type': 'application/json' }
            });
            setStatus({
                success: true,
                message: "Teste criado com sucesso."
            });
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 1000);
        } catch (error) {
            console.error('Erro ao criar teste:', error);
            const errorMessage = error.response?.data?.error || error.request || 'Erro desconhecido ao criar teste';
            setStatus({
                success: false,
                message: `Ocorreu um erro: ${errorMessage}`
            });
        }
    };

    return (
        <main className="page-content">
            <h6 className="text-uppercase">Novo Teste de {dadosInfoUser && dadosInfoUser.hora_teste} hora(s)</h6>
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
                                        Nome Completo*
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("nome", { required: true })} />
                                        {errors.nome && <small>Nome completo é obrigatório.</small>}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Usuário*
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("usuario", { required: true })} type="text" />
                                        {errors.usuario && <small>Código é obrigatório.</small>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Senha*
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("senha", { required: true })} type="text" />
                                        {errors.senha && <small>Senha de liberação é obrigatório.</small>}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        E-mail
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("email")} type="email" />
                                        {errors.email && <small>Email é obrigatório.</small>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">WhatsApp</label>
                                    <div className="col-sm-8">
                                        <Controller
                                            name="whatsapp"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <IMaskInput
                                                    {...field}
                                                    mask="(00) 00000-0000"
                                                    placeholder="(XX) XXXXX-XXXX"
                                                    unmask={true} // Decide se os valores devem incluir a máscara ou não
                                                    onAccept={(value, mask) => field.onChange(value)} // Garante que o valor seja atualizado corretamente
                                                    className={`form-control ${errors.whatsapp ? 'is-invalid' : ''}`}
                                                />
                                            )}
                                        />
                                        {errors.whatsapp && <small>WhatsApp é obrigatório.</small>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Selecione o Servidor*
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
                                <hr />
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
        </main>
    );
}

export default NovoUsuarioTeste;
