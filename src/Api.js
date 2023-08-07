import axios from "axios"

const Api = axios.create({
    baseURL: 'https://api.bigbox.guru'
});

export default Api