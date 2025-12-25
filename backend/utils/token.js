import jwt from 'jsonwebtoken';

const generateAccessToken = (userID, userRole, audienceType) => {
    return jwt.sign({id: userID, role: userRole, audienceType}, process.env.JWT_SECRET, {expiresIn: '10m'});
}

const generateRefreshToken = (userID, userRole, audienceType) => {
    return jwt.sign({id: userID, role: userRole, audienceType}, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'});
}

export {
    generateAccessToken,
    generateRefreshToken
}