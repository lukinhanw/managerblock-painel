import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Api from '../Api';
import useAuth from '../Context/hook_useAuth';
import { v4 as uuidv4 } from 'uuid';
import '../Components/css/Login.css';
import { useNavigate } from 'react-router-dom';

const VERSION = process.env.REACT_APP_VERSION || '1.0.0';

const Login = () => {
    const [status, setStatus] = useState({ success: false, message: '' });
    const { signin } = useAuth();
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [infoLogin, setInfoLogin] = useState({});

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({ mode: 'onChange' });

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const cachedInfo = JSON.parse(localStorage.getItem('info'));
                if (cachedInfo) {
                    setInfo(cachedInfo);
                }

                const response = await Api.get('info-public');
                if (response.data && response.data.length > 0) {
                    const newInfo = response.data[0];
                    if (!cachedInfo || cachedInfo.logo !== newInfo.logo) {
                        localStorage.setItem('info', JSON.stringify(newInfo));
                        setInfo(newInfo);
                    }
                }
            } catch (error) {
                console.error('Error fetching info:', error);
            }
        };

        fetchInfo();
    }, []);

    const onSubmit = async (dados) => {
        setLoading(true);
        try {
            const token = uuidv4();
            const response = await Api.put('login', { ...dados, token });

            setTimeout(() => {
                if (response.data && response.data.length > 0) {
                    setInfoLogin({ ...response.data[0], token });
                }
                setLoading(false);
            }, 500);
        } catch (error) {
            setTimeout(() => {
                setStatus({
                    success: false,
                    message: error.data?.error || "Erro ao fazer login. Tente novamente."
                });
                setLoading(false);
            }, 500);
        }
    };

    useEffect(() => {
        if (infoLogin && infoLogin.status === 0) {

            signin({
                nome: infoLogin.nome,
                idUsuario: infoLogin.id,
                token: infoLogin.token
            }, true);

        }

        if (infoLogin && infoLogin.status === 1) {
            setStatus({
                success: false,
                message: "Erro, código 171, contate seu administrador."
            });
        }
    }, [infoLogin, signin, navigate]);

    return (
        <div className="login-container">
            <div className="login-background-effects">
                <div className="gradient-sphere"></div>
                <div className="gradient-sphere secondary"></div>
            </div>

            <div className="login-card">
                <div className="login-card-body">
                    {info && (
                        <div className="brand-container animate-fade-in">
                            {info.logo && info.logo.length > 10 ? (
                                <img src={info.logo} className="login-logo" alt="Logo" />
                            ) : (
                                <h4 className="login-title">{info.titulo_painel}</h4>
                            )}
                            <p className="welcome-text">
                                Bem-vindo ao seu painel de controle
                                <span className="welcome-subtitle">
                                    Faça login para acessar sua conta
                                </span>
                            </p>
                        </div>
                    )}

                    {status.message && (
                        <div className={`alert-custom ${status.success ? 'success' : 'error'}`}>
                            <span className="alert-icon">
                                {status.success ? '✓' : '⚠'}
                            </span>
                            <span className="alert-message">{status.message}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                        <div className="form-group">
                            <input
                                type="text"
                                className={`form-input ${errors.usuario ? 'error' : ''}`}
                                placeholder="Usuário"
                                {...register("usuario", {
                                    required: "Usuário é obrigatório",
                                    minLength: {
                                        value: 3,
                                        message: "Mínimo de 3 caracteres"
                                    }
                                })}
                            />
                            {errors.usuario && (
                                <span className="error-message">{errors.usuario.message}</span>
                            )}
                        </div>

                        <div className="form-group mt-2">
                            <input
                                type="password"
                                className={`form-input ${errors.senha ? 'error' : ''}`}
                                placeholder="Senha"
                                {...register("senha", {
                                    required: "Senha é obrigatória",
                                    minLength: {
                                        value: 4,
                                        message: "Mínimo de 4 caracteres"
                                    }
                                })}
                            />
                            {errors.senha && (
                                <span className="error-message">{errors.senha.message}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="login-button mt-2"
                            disabled={loading || !isValid}
                        >
                            {loading ? (
                                <div className="button-content">
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    <span>Entrando...</span>
                                </div>
                            ) : (
                                <span>Entrar</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <footer className="footer">
                <p>
                    {info && info.titulo_painel} &copy; {new Date().getFullYear()}
                    <br />
                    Desenvolvido por 8Tech 🧡
                    <span className="version">v{VERSION}</span>
                </p>
            </footer>
        </div>
    );
};

export default Login;