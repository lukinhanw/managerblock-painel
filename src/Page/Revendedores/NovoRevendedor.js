import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Api from '../../Api';
import Select from 'react-select'
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

const NovoRevendedor = () => {

    const [showModalAdd, setShowModalAdd] = useState(false)
    const [modalData, setModalData] = useState({})
    
    const navigate = useNavigate()

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
 
    const [status, setStatus] = useState({ success: false, message: '' });
    const { idUsuario, token } = JSON.parse(localStorage.getItem("user_token"))

    const [dadosInfoUser, setDadosInfoUser] = useState(null);
    useEffect(() => {
        Api.get(`info/${idUsuario}`).then((response) => {
            setDadosInfoUser(response.data);
        });

    }, [idUsuario]);

    var newIDUsuario = idUsuario
    if (dadosInfoUser && dadosInfoUser.id_dono === 0) {
        newIDUsuario = 0
    }

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors }
    } = useForm();

    const onSubmit = async (dados) => {
        try {
            // Prepara os dados para envio
            const dadosEnviar = {
                ...dados,
                id_dono: dados.id_dono.value
            };
    
            // Executa a requisição POST
            await Api.post('novo-revendedor', JSON.stringify(dadosEnviar), {
                headers: { 'Content-Type': 'application/json' }
            });
    
            // Atualiza o modal e o status
            setModalData({ usuario: dados.usuario_painel, senha: dados.senha_painel });
            setShowModalAdd(true);
            setStatus({
                success: true,
                message: "Revendedor criado com sucesso."
            });
            window.scrollTo(0, 0);
            reset();
        } catch (error) {
            console.error('Erro ao criar revendedor:', error);
            // Define uma mensagem de erro baseada na resposta ou no erro genérico
            const errorMessage = error.response?.data?.error || error.request || 'Erro desconhecido ao criar revendedor';
            setStatus({
                success: false,
                message: `Ocorreu um erro: ${errorMessage}`
            });
        }
    };    

    const [dataRevendedores, setDataRevendedores] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await Api.get(`listar-revendedores/${newIDUsuario}`);
                setDataRevendedores(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [newIDUsuario]);

    //Redireciona caso nao seja admin
    if (dadosInfoUser && dadosInfoUser.id_dono !== 0) {
        navigate("/")
        return null
    }

    return (
        <main className="page-content">
            <h6 className="text-uppercase">Novo Revendedor</h6>
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
                                        Nome Completo*
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("nome", { required: true })} />
                                        {errors.nome && <small>Nome completo é obrigatório.</small>}
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
                                        <input className="form-control" type='number' placeholder='DD+Telefone' {...register("whatsapp")} />
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
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Dono *
                                    </label>
                                    <div className="col-sm-8">
                                        <Controller
                                            name="id_dono"
                                            control={control}
                                            defaultValue=""
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    options={dataRevendedores.map((value) => {
                                                        return {
                                                            value: value.id,
                                                            label: `${value.usuario_painel}`,
                                                        };
                                                    })}
                                                    styles={customStyles}
                                                    isSearchable
                                                    placeholder="Selecione"
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
                                        <input className="form-control" {...register("usuario_painel", { required: true })} type="text" />
                                        {errors.usuario_painel && <small>Usuário do Painel de liberação é obrigatório.</small>}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label">
                                        Senha do Painel *
                                    </label>
                                    <div className="col-sm-8">
                                        <input className="form-control" {...register("senha_painel", { required: true })} type="password" />
                                        {errors.senha_painel && <small>Senha do Painel de liberação é obrigatório.</small>}
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
                    <p>Revendedor criado com sucesso.</p>
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

export default NovoRevendedor;
