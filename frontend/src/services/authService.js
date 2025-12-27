import axios from "axios";

const loginAPI = async (email, password) => {
    return await axios.post('/api/auth/login', { email, password });
}

const logoutAPI = async () => {
    return await axios.post('/api/auth/logout');
}

const refreshAPI = async() => {
    return await axios.post('/api/auth/refreshAccessToken');
}

export {
    loginAPI,
    logoutAPI,
    refreshAPI
}