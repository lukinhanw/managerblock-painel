import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async';

// Layout
import Header from './Layout/Header';
import Sidebar from './Layout/Sidebar';
import Dashboard from './Page/Dashboard';

// Pages
import NovoCodigo from './Page/Codigos/NovoCodigo';
import ListarCodigos from './Page/Codigos/ListarCodigos';
import EditarCodigo from './Page/Codigos/EditarCodigo';
import NovoRevendedor from './Page/Revendedores/NovoRevendedor';
import ListarRevendedores from './Page/Revendedores/ListarRevendedores';
import EditarRevendedor from './Page/Revendedores/EditarRevendedor';
import NovoTeste from './Page/Testes/NovoTeste';
import EditarTeste from './Page/Testes/EditarTeste';
import LogCreditos from './Page/Log/LogCreditos';
import LogAcoes from './Page/Log/LogAcoes';
import Ajustes from './Page/Ajustes/Ajustes';
import Login from './Page/Login';
import Perfil from './Page/Perfil/Perfil';

// Auth
import useAuth from "./Auth/hook_useAuth";
import Api from './Api';
import { useEffect, useState } from 'react';

function AuthenticatedRoutes() {
	return (
		<Routes>
			<Route path="*" element={<Dashboard />} />
			<Route path="/novo-codigo" element={<NovoCodigo />} />
			<Route path="/listar-codigos" element={<ListarCodigos />} />
			<Route path="/editar-codigo/:id" element={<EditarCodigo />} />
			<Route path="/novo-revendedor" element={<NovoRevendedor />} />
			<Route path="/listar-revendedores" element={<ListarRevendedores />} />
			<Route path="/editar-revendedor/:id" element={<EditarRevendedor />} />
			<Route path="/editar-codigo/:id" element={<EditarRevendedor />} />
			<Route path="/novo-teste" element={<NovoTeste />} />
			<Route path="/editar-teste/:id" element={<EditarTeste />} />
			<Route path="/logs-creditos" element={<LogCreditos />} />
			<Route path="/logs-acoes" element={<LogAcoes />} />
			<Route path="/ajustes" element={<Ajustes />} />
			<Route path="/perfil" element={<Perfil />} />
		</Routes>
	);
}

function App() {
	const { signed, signout } = useAuth()
	const [info, setInfo] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [menuOpen, setMenuOpen] = useState(true);

	let token = null;
	const userToken = localStorage.getItem("user_token");

	if (userToken) {
		const data = JSON.parse(userToken);
		token = data.token;
	}

	Api.interceptors.response.use(
		function (response) {
			return response;
		},
		function (error) {
			if (error.response.status === 400) {
				signout();
			}
			return Promise.reject(error);
		}
	);



	useEffect(() => {

		Api.get('info-public')
			.then(response => {
				setInfo(response.data[0])
				if (token) {
					setIsLoading(false)
				} else {
					signout()
					setIsLoading(false)
				}
			})
			.catch(error => {
				console.error(error);
				setIsLoading(false);
			});

	}, [signout, token]);

	const LoadingScreen = () => (
		<div className="loading-screen">
			<div className="loading-icon"></div>
		</div>
	);

	if (isLoading) {
		return <LoadingScreen />
	}

	return (
		<HelmetProvider>
			{info && (
				<Helmet>
					<title>{info.titulo_painel} - Painel</title>
				</Helmet>
			)}
			<Router>
				{signed ? (
					<>
						<Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
						<Sidebar menuOpen={menuOpen} />
						<AuthenticatedRoutes />
					</>
				) : (
					<Routes>
						<Route path="*" element={<Login />} />
					</Routes>
				)}
			</Router>
		</HelmetProvider>
	);
}

export default App;

