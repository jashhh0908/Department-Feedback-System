import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    const userLogout = async () => {
        await logout();
    }
    if(!user) return null;
  return (
    <nav className="bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center text-white">
            <div className="text-teal-400 font-bold text-xl">
                <Link to='/dashboard'>Admin Dashboard</Link>
            </div>
            
            <div className="flex items-center gap-6">
                <span>Welcome, <strong>{user.name}</strong></span>
                <button 
                    onClick={userLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition text-sm font-medium"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar