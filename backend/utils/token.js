import jwt from 'jsonwebtoken';

const generateAccessToken = (userID, userRole) => {
    return jwt.sign({id: userID, role: userRole}, process.env.JWT_SECRET, {expiresIn: '10m'});
}

const generateRefreshToken = (userID, userRole) => {
    return jwt.sign({id: userID, role: userRole}, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'});
}

export {
    generateAccessToken,
    generateRefreshToken
}