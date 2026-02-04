import axios from 'axios';

export const createForm = async (formData) => {
    return await axios.post('/api/form/create', formData);
}

export const getForms = async () => {
    return await axios.get('/api/form/get');
}

export const getFormById = async (formId) => {
    return await axios.get(`/api/form/get/${formId}`);
}

export const getArchivedForm = async () => {
    return await axios.get('/api/form/get-archived');
}
export const updateForm = async (formId, updatedData) => {
    return await axios.put(`/api/form/update/${formId}`, updatedData);
}

export const deletePermanently = async (formId) => {
    return await axios.delete(`/api/form/delete/${formId}`);
}

export const toggleForm = async (formId) => {
    return await axios.post(`/api/form/toggle/${formId}`);
}
export const deactivateForm = async (formId) => {
    return await axios.post(`/api/form/deactivate/${formId}`);
}

export const reactivateForm = async (formId) => {
    return await axios.post(`/api/form/reactivate/${formId}`);
}

export const getFormByIdForUser = async (formId) => {
    return await axios.get(`/api/user/get/${formId}`);
}

export const submitResponse = async (formId, data) => {
    return await axios.post(`/api/user/fill-form/${formId}`, data);
}

export const getFormAnalytics = async (formId) => {
    return await axios.get(`/api/form/${formId}/analytics`);
}