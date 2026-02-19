import React, { useContext, useEffect, useState } from 'react'
import { deleteUserById, getAllUsers } from '../services/adminService';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const typeStyles = {
    student: "bg-teal-500/20 text-teal-400",
    alumni: "bg-blue-500/20 text-blue-400",
    employer: "bg-purple-500/20 text-purple-400",
    default: "bg-gray-700 text-gray-300"
};

const UserManagement = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const {data} = await getAllUsers();
            setUsers(data.users);
            toast.success("Users fetched successfully");
        } catch (error) {
            toast.error("Failed to fetch users");
            console.log("Error: ", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteOne = async(userId, name) => {
        if(window.confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                await deleteUserById(userId);
                toast.success("User deleted successfully");
                fetchUsers();
            } catch (error) {
                toast.error("Failed to delete user");
                console.log("Error delete: ", error);
            } 
        }
    }

    const filteredUsers = users.filter((u) => {
        if(currentUser?.role === 'super-admin') {
            return u.role === 'admin';
        }
        if(currentUser?.role === 'admin') {
            return u.role === 'user';
        }
    })
    if(loading) return <div className="text-teal-400">Loading students...</div>
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-800/50 text-gray-400 text-sm uppercase">
                        <th className="p-4 font-medium">Name</th>
                        <th className="p-4 font-medium">Email</th>
                        {currentUser?.role === 'admin' && <th className="p-4 font-medium">Type</th>} 
                        {currentUser?.role === 'super-admin' && <th className="p-4 font-medium">Role</th>}
                        <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-800/30 transition">
                            <td className="p-4 font-medium">{user.name}</td>
                            <td className="p-4 text-gray-400">{user.email}</td>
                            {currentUser?.role === 'admin' && <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    typeStyles[user.audienceType] || typeStyles.default
                                }`}>
                                    {user.audienceType}
                                </span>
                            </td>}
                            {currentUser?.role === 'super-admin' && <td className="p-4">
                                <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter bg-blue-500/20 text-blue-400"
                                >
                                    {user.role}
                                </span>
                            </td>}

                            <td className="p-4 text-right">
                                <button 
                                    onClick={() => deleteOne(user._id, user.name)}
                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {users.length === 0 && (
                <div className="p-10 text-center text-gray-500">No users found in the system.</div>
            )}
        </div>
    );
}

export default UserManagement