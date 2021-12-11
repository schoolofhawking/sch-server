const jwt = require('jsonwebtoken')
const User = require('../models/user')

export const adminAuth = async (req, res, next) => {

    // 1) check if the token is there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("AdminJwt")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        console.log("NO JWT TOKEN)))");
        return res.status(422).json({
            error: true,
            message: 'You are not logged in (try - AdminJwt)'
        })
    }

    // 2) Verify token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            console.log("JWT ERROR");
            return res.status(422).json({
                error: true,
                message: err + ""
            })
        } else {
            console.log('uiuiui', decoded)
            // 3) check if the user is exist or valid
            let adminDetails = await User.findById(decoded._id);
            if (!adminDetails) {
                return res.status(422).json({
                    error: true,
                    message: 'User no longer exist'
                })
            }
            console.log("Middleware Success");

            req.admin = adminDetails;
            next();
        }
    });
}