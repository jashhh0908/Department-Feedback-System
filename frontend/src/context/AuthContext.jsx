import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // This function checks if the user has a valid cookie session
    const checkAuth = async () => {
        try {
            // This calls your backend refreshAccessToken route
            const { data } = await axios.post('/api/auth/refreshAccessToken');
            
            // If successful, we save the user info (name, role, etc.)
            setUser(data.userInfo);
            
            // Set the Access Token in Axios headers for future API calls
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await axios.post('api/auth/logout');
            setUser(null);
            delete axios.defaults.headers.common['Authorization'];
        } catch (error) {
            console.error("Logout failed: ", error);
        }
    }
    return (
        <AuthContext.Provider value={{ user, setUser, loading, checkAuth, logout }}>
            {/* We don't render the app until the check is finished */}
            {!loading && children}
        </AuthContext.Provider>
    );
};