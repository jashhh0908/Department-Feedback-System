import jwt from 'jsonwebtoken';

const generateAccessToken = (adminID) => {
    return jwt.sign({id: adminID}, process.env.JWT_SECRET, {expiresIn: '10m'});
}

const generateRefreshToken = (adminID) => {
    return jwt.sign({id: adminID}, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'});
}

export {
    generateAccessToken,
    generateRefreshToken
}