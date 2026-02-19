import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';

const AdminLayout = ({ children }) => {
    return (
        <div className="h-screen bg-gray-950 text-white flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 p-10 overflow-y-auto">
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
