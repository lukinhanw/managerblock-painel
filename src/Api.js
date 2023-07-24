import axios from "axios"

const Api = axios.create({
    baseURL: 'https://api.tvboxelite.com.br'
});

export default Api