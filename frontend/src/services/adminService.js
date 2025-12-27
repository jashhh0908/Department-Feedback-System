import axios from 'axios';

const getAllUsers = async () => {
    return await axios.get('/api/auth/readUsers');
}

const deleteUserById = async (userId) => {
    return await axios.delete(`/api/auth/delete/${userId}`);
}

export {
    getAllUsers,
    deleteUserById
}