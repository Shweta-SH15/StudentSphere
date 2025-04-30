module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'yoursecret',
    mongoURI: process.env.MONGO_URI || 'your-mongo-uri-here'
};
