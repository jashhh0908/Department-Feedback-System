import React from 'react';
import FormManagement from '../components/FormManagement.jsx';

const FormsPage = () => {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold">Managing Forms</h1>
                <p className="text-gray-400 mt-2">Create, activate, archive, and share feedback forms.</p>
            </header>
            <FormManagement />
        </div>
    );
};

export default FormsPage;
