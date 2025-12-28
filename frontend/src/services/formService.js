import axios from 'axios';

const createForm = async (formData) => {
    return await axios.post('/api/form/create', formData);
}

const getForms = async () => {
    return await axios.get('/api/form/get');
}

const getFormById = async (formId) => {
    return await axios.get(`/api/form/get/${formId}`);
}

const updateForm = async (formId, updatedData) => {
    return await axios.get(`/api/form/update/${formId}`, updatedData);
}

const deletePermanently = async (formId) => {
    return await axios.delete(`/api/form/delete/${formId}`);
}

const toggleForm = async (formId) => {
    return await axios.post(`/api/form/toggle/${formId}`);
}
const deactivateForm = async (formId) => {
    return await axios.post(`/api/form/deactivate/${formId}`);
}

const reactivateForm = async (formId) => {
    return await axios.post(`/api/form/reactivate/${formId}`);
}

export {
    createForm,
    getForms,
    getFormById,
    updateForm,
    deletePermanently,
    toggleForm,
    deactivateForm,
    reactivateForm
}