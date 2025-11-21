export const authorize = (...role) => { // ... -> rest parameter - it converts the incoming arguments into an array
    return (req, res, next) => { //middleware
        if(!req.user || !role.includes(req.user.role)) 
            return res.status(403).json({message: "Access forbidden"});
        next();
    };
};

//L3:
/*
    We converted to an array because we need to check if the role exists in req.user
    If we pass the role as a string, we cannot check if the role exists in req.user since include method works consistently with arrays

    Execution flow explanation: 
    1. authorize('admin') is called during route definition and returns a middleware function
    2. When a request hits the route, the returned middleware function executes
*/