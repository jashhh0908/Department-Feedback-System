import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
            <div className="w-24 h-24 bg-teal-500/20 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-teal-500/10 animate-bounce-short">
                <svg 
                    className="w-12 h-12 text-teal-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="3" 
                        d="M5 13l4 4L19 7" 
                    />
                </svg>
            </div>
            <h1 className="text-4xl font-black mb-4 text-white uppercase tracking-tight">
                Feedback Received!
            </h1>
            <p className="text-gray-400 text-lg max-w-md mb-10 leading-relaxed">
                Thank you for your contribution. Your responses have been securely recorded and will help improve our department's standards.
            </p>

            <button 
                onClick={() => navigate('/')}
                className="px-10 py-4 bg-teal-600 hover:bg-teal-500 text-gray-900 font-bold rounded-2xl transition-all transform active:scale-95 shadow-xl shadow-teal-600/20 uppercase tracking-widest text-sm"
            >
                Return to Home
            </button>
            
            <p className="mt-8 text-gray-600 text-xs">
                You can now safely close this window.
            </p>
        </div>
    );
};

export default SuccessPage;