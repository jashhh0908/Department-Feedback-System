import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (pathPrefix) => location.pathname === pathPrefix || location.pathname.startsWith(`${pathPrefix}/`);
    const tabClass = (active) =>
        `w-full text-left px-4 py-2 rounded-lg transition ${
            active
              ? 'bg-gradient-to-r from-teal-500/20 to-transparent text-teal-400 border-l-4 border-teal-400 pl-3'
              : 'hover:bg-gray-800'

        }`;

    return (
    <div className="w-64 shrink-0 h-full bg-gray-900 border-r border-gray-800 p-8 flex flex-col">
            <button onClick={() => navigate('/dashboard')} className="text-left mb-10 group">
                <h2 className="text-xl font-bold text-teal-400">Admin Panel</h2>
            </button>

            <nav className="space-y-4 flex-1">
                <button onClick={() => navigate('/dashboard/users')} className={tabClass(isActive('/dashboard/users'))}>
                Manage Users        
                </button>

                <button onClick={() => navigate('/dashboard/analytics')} className={tabClass(isActive('/dashboard/analytics'))}>
                View Analytics        
                </button>

                <button onClick={() => navigate('/dashboard/forms')} className={tabClass(isActive('/dashboard/forms'))}>
                Manage Forms      
                </button>
            </nav>
        </div>
    )
}

export default Sidebar
