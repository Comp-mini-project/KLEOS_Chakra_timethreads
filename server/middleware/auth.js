const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decodedTocken = jwt.verify(token, process.env.SECRET_KEY);
        const { _id, uid, displayName, photoUrl, email } = decodedTocken;
        req.user = {
            _id,
            uid,
            displayName,
            photoUrl,
            email,
        };
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            message:
                'Something is wrong with your authorization, please sign in again.',
        });
    }
};

module.exports = auth;
