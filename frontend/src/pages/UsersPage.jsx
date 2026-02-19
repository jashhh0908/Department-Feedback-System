import React from 'react';
import UserManagement from '../components/UserManagement.jsx';

const UsersPage = () => {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold">Managing Users</h1>
                <p className="text-gray-400 mt-2">Here you can manage users in the system.</p>
            </header>
            <UserManagement />
        </div>
    );
};

export default UsersPage;
