import React, { useState } from 'react'
import UserManagement from '../components/UserManagement.jsx';
import Analytics from './Analytics.jsx';
const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("users");
    return (
    <div className="flex min-h-screen bg-gray-950 text-white">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col">
            <h2 className="text-xl font-bold text-teal-400 mb-10">Admin Panel</h2>
            <nav className="space-y-4 flex-1">
                <button 
                    onClick={() => setActiveTab("users")}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${activeTab === 'users' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/50' : 'hover:bg-gray-800'}`}
                >
                Manage Users        
                </button>

                <button 
                    onClick={() => setActiveTab("analytics")}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${activeTab === 'analytics' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/50' : 'hover:bg-gray-800'}`}
                >
                View Analytics        
                </button>
            </nav>
        </div>

        <div className="flex-1 p-10">
            <header className="mb-8">
                <h1 className='text-2xl font-bold'>
                    {activeTab === 'users' ? "Managing Users" : "Viewing Analytics"}
                </h1>
                <p className='text-gray-300'>
                    {activeTab === 'users' ? "Here you can manage the users" : "Here you can view the analytics for the forms"}
                </p>
            </header>

            <main>
                {activeTab === 'users' ? <UserManagement /> : <Analytics />}
            </main>
        </div>
    </div>
    )
}

export default Dashboard