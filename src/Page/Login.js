import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Api from '../Api';
import useAuth from '../Context/hook_useAuth';
import { v4 as uuidv4 } from 'uuid';

const Login = () => {

    const [status, setStatus] = useState({ success: false, message: '' });
    const { signin } = useAuth();

    const [info, setInfo] = useState(null);
    useEffect(() => {
        Api.get(`info-public`).then((response) => {
            setInfo(response.data[0]);
        });
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        // Definindo os estilos do body quando o componente é montado
        if (info) {
            document.body.style.backgroundImage = `url(${info.background})`;
            document.body.style.backgroundRepeat = "no-repeat";
            document.body.style.backgroundSize = "cover";
        }

        // Removendo os estilos quando o componente é desmontado
        return () => {
            document.body.style.backgroundImage = "";
            document.body.style.backgroundRepeat = "";
            document.body.style.backgroundSize = "";
        }
    }, [info]);


    const onSubmit = async (dados) => {
        try {
            const token = uuidv4();

            const response = await Api.put('login', JSON.stringify({ ...dados, token }), {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log(response);

            setStatus({
                success: true,
                message: "Credenciais aceitas, fazendo login..."
            });

            signin({ nome: response.data[0].nome, idUsuario: response.data[0].id, token: token }, true);

        } catch (error) {
            if (error.response) {
                setStatus({
                    success: false,
                    message: error.response.data.error
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
        <div>
            <div className="container-fluid my-5">
                <div className="row">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5 col-xxl-4 mx-auto">
                        <div className="card border-3">
                            <div className="card-body p-5">
                                <img src={info && info.logo} className="mb-4" height="100" alt="" />
                                <h4 className="fw-bold">{info && info.titulo_painel}</h4>
                                <p className="mb-0">Insira suas credenciais para acessar sua conta</p>
                                {status.message && (
                                    <div className={`alert ${status.success ? 'alert-success' : 'alert-danger'} alert-dismissible mt-4`} role="alert">
                                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        <div className="alert-icon">
                                            <i className="far fa-fw fa-bell"></i>
                                        </div>
                                        <div className="alert-message">
                                            {status.message}
                                        </div>
                                    </div>
                                )}
                                <div className="form-body mt-4">
                                    <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                                        <div className="col-12">
                                            <label className="form-label">Usuário</label>
                                            <input className="form-control" {...register("usuario", { required: true })} />
                                            {errors.usuario && <small>Campo usuário é obrigatório.</small>}
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Senha</label>
                                            <input type="password" className="form-control" {...register("senha", { required: true })} />
                                            {errors.senha && <small>Campo senha é obrigatório.</small>}
                                        </div>

                                        <div className="col-12 mt-4">
                                            <div className="d-grid">
                                                <button type="submit" className="btn btn-primary">Entrar</button>
                                            </div>
                                        </div>

                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="footer bg-dark fixed-bottom text-white text-center py-3">
                <p>
                    {info && info.titulo_painel} &copy; {new Date().getFullYear()} - Todos os direitos reservados.
                    <br />
                    Desenvolvido por 8Tech 🧡
                </p>
            </footer>
        </div>
    );
}

export default Login;