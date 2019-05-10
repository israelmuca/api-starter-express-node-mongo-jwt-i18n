/*
* These functions are used to create and verify JWT
* All JWT are created with the most context possible (from getSetContext.js)
* All JWT are decoded and if valid, the most context possible (from getSetContext.js) is set before calling next()
*/
import jwt from 'jsonwebtoken'
import dotenv from '../config/env'
import { setCurrentUserId, setCurrentUserIsAdmin } from './getSetContext'


/*
* Function to create a token
* Receives the payload to include and the expiration of the token
* Returns the token
*/
exports.createJWT = (payload, expiration) => {

    const token = jwt.sign(payload, process.env.JWT_SECRET, expiration)
    return token
}

/*
* Function to verify a token's validity, and create the Company's & User's context
* Receives the regular express req, res, next
* Auth errors send status 401
* Returns, if user is auth, context is set and next() is called to proceed forward with the req
*/
exports.verifyJWT = (req, res, next) => {

    // Confirm there's an auth header
    if (!req.headers.authorization) {
        return res.status(401).send({ auth: false, message: req.polyglot.t('401-failedAuth'), token: null })
    }

    // Get Bearer Token & verify it
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
            return res.status(401).send({ auth: false, message: req.polyglot.t('401-failedAuth'), token: null })
        }

        // If token is valid, create the context when it is available
        if (decoded.userId) { setCurrentUserId(decoded.userId) }
        if (decoded.userIsAdmin) { setCurrentUserIsAdmin(decoded.userIsAdmin) }

        next()
    })

}