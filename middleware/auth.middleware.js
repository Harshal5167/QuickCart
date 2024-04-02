const jwt = require('jsonwebtoken')

const isAuthenticated = (req, res, next) => {
    const bearerToken = req.headers['authorization'];
    // console.log(bearerToken);
    if (!bearerToken) {
        return res.status(401).json({
            status: "error",
            msg: "token not provided"
        })
    }

    const token = bearerToken.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            status: "error",
            msg: "invalid token format"
        })
    }

    const verify = jwt.verify(token, process.env.SECRET_KEY)
    req.verify = verify

    next()
}

module.exports = isAuthenticated