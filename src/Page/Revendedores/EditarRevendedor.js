import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Api from '../../Api';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select'

const EditarRevendedor = () => {


    const customStyles = {
        control: (base, state) => ({
            ...base,
            fontSize: "1rem",
            backgroundColor: "#212529",
            border: "1px solid #495057",
            borderRadius: "0.25rem",
            boxShadow: state.isFocused ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" : null,
            borderColor: state.isFocused ? "#86b7fe" : base.borderColor,
        }),
        singleValue: (base) => ({
            ...base,
            color: '#adb5bd',

        }),
        input: (base) => ({
            ...base,
            color: '#adb5bd',

        }),
        menu: (base) => ({
            ...base,
            backgroundColor: '#35383c',
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? '#212529' : null,
        }),

    };


    const { id } = useParams();
    const [status, setStatus] = useState({ success: false, message: '' });
    const { idUsuario, token } = JSON.parse(localStorage.getItem("user_token"))
    const [initialData, setInitialData] = useState(null);
    const navigate = useNavigate();


    const [dadosInfoUser, setDadosInfoUser] = useState(null);
    useEffect(() => {
        Api.get(`info/${idUsuario}`).then((response) => {
            setDadosInfoUser(response.data);
        });

    }, [idUsuario]);


    const [dataRevendedores, setDataRevendedores] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await Api.get(`listar-revendedores/${idUsuario}`);
                setDataRevendedores(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [idUsuario]);

    // Elimina a chave do array em que o ID seja igual a ele mesmo
    let filteredRevendedores = dataRevendedores;
    if (initialData) {
        filteredRevendedores = dataRevendedores.filter(revendedor => revendedor.id !== initialData.id);
    }

    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Api.post(`revendedor/${id}`, JSON.stringify({ 'token': token }), {
                    headers: { 'Content-Type': 'application/json' }
                });
                setInitialData(response.data);
            } catch (error) {
                navigate("/");
            }
        };

        fetchData();
    }, [id, navigate, token]);  // Apenas para buscar os dados


    useEffect(() => {
        if (initialData) {
            setValue("id_dono", { value: initialData.id_dono, label: initialData.nome_dono });
        }
    }, [initialData, setValue]);  // Apenas para definir o valor

    const onSubmit = async (dados) => {
        try {
            // Prepara os dados para envio
            const dadosEnviar = {
                ...dados,
                id_dono: dados.id_dono.value
            };

            // Executa a requisição PUT
            await Api.put(`editar-revendedor/${id}`, JSON.stringify(dadosEnviar), {
                headers: { 'Content-Type': 'application/json' }
            });

            // Atualiza o status em caso de sucesso
            setStatus({
                success: true,
                message: "Revendedor editado com sucesso."
            });
        } catch (error) {
            console.error('Erro ao editar revendedor:', error);
            // Define uma mensagem de erro baseada na resposta ou no erro genérico
            const errorMessage = error.response?.data?.error || error.request || 'Erro desconhecido ao editar revendedor';
            setStatus({
                success: false,
                message: `Ocorreu um erro: ${errorMessage}`
            });
        }
    };

    if (!initialData) {
        return <div>Carregando...</div>;
    }

    //Redireciona caso nao seja admin
    if (dadosInfoUser && dadosInfoUser.id_dono !== 0) {
        navigate("/")
        return null
    }

    return (

        <main className="page-content">
            <h6 className="text-uppercase">Editar Revendedor</h6>
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

                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Dono *
                                    </label>
                                    <div className="col-sm-8">
                                        <Controller
                                            name="id_dono"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    placeholder="Selecione"
                                                    noOptionsMessage={() => "Sem Opções"}
                                                    isClearable
                                                    {...field}
                                                    styles={customStyles}
                                                    options={filteredRevendedores.map(revendedor => ({
                                                        value: revendedor.id,
                                                        label: revendedor.nome
                                                    }))}
                                                />
                                            )}
                                        />
                                        {errors.creditos && <small>Dono é obrigatório.</small>}
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

export default EditarRevendedor;
