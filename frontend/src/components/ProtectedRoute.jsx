import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
const ProtectedRoute = ({ children, adminOnly = false}) => {
    const {user, loading} = useContext(AuthContext);
    if(loading)
        return <div>Loading...</div>;

    if(!user) {
        toast.error("Please login to continue");
        console.log("Access Denied: No User Found");
        return <Navigate to='/' replace />;
    }

    if(adminOnly && user.role !== 'admin' && user.role !== 'super-admin') {
        toast.error("Access Denied: Admin privileges required");
        console.log("Access Denied: User is not an Admin. Role is:", user.role);
        return <Navigate to='/' replace />;
    }
    console.log("Access Granted!");
    return children;
}

export default ProtectedRoute;