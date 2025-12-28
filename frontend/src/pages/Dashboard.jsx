import React, { useState } from 'react'
import Sidebar from '../components/Sidebar.jsx';
import UserManagement from '../components/UserManagement.jsx';
import Analytics from './Analytics.jsx';
import FormManagement from '../components/FormManagement.jsx';
const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("home");
    return (
        <div className="flex min-h-screen bg-gray-950 text-white">
            
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab}></Sidebar>      
            <div className="flex-1 p-10">
                <header className="mb-8">
                    <h1 className='text-2xl font-bold'>
                        {activeTab === 'home' && <p className='text-2xl font-bold text-gray-300'>
                            Welcome to the Dashboard
                        </p>}
                        {activeTab === 'users' && "Managing Users"}
                        {activeTab === 'analytics' && "Viewing Analytics"}
                        {activeTab === 'forms' && "Managing Forms"}
                    </h1>
                    <p className='text-gray-300'>
                        {activeTab === 'users' && "Here you can manage the users"}
                        {activeTab === 'analytics' && "Here you can view the analytics for the forms"}
                        {activeTab === 'users' && "Here you can manage your feedback forms"}
                    </p>
                </header>

                <main>
                    {activeTab === 'users' && <UserManagement />}
                    {activeTab === 'analytics' && <Analytics />}
                    {activeTab === 'forms' && <FormManagement />}
                </main>
            </div>  
        </div>
    )
}

export default Dashboard