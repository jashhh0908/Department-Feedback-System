 
const Sidebar = ({ activeTab, setActiveTab}) => {
    return (
    <div className="flex min-h-screen bg-gray-950 text-white">
        <div className="w-64 bg-gray-900 border-r border-gray-800 p-8 flex flex-col">
            <button 
                onClick={() => setActiveTab("home")}
                className="text-left mb-10 group"
            >
                    <h2 className="text-xl font-bold text-teal-400">Admin Panel</h2>
            </button>
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

    </div>
    )
}

export default Sidebar