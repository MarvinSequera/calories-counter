import jwt from 'jsonwebtoken'
const jwtToken = process.env.JWT_TOKEN

const verifyToken = (req, res, next) => {
    const token = req.headers['x-calories-counter-token']

    if (!token) {
        return res.status(403).send("A token is required for authentication")
    }

    try {
        const decoded = jwt.verify(token, jwtToken)
    } catch {
        return res.status(401).send("Invalid Token")
    }

    return next()
}

export { verifyToken }
