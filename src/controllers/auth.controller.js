import User from '../models/user.model'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { createJWT } from '../utilities/createVerifyJWT'
import dotenv from '../config/env'
import moment from 'moment'
import mailer from '../utilities/sendGridMailer'
import { errorLogger } from '../utilities/logger'
import to from 'await-to-js'


/*
* Login function
* Receives an email and a password
* Validation errors send status 400, auth errors status 401, server errors status 500
* Returns, if user is auth, status 200 & a 12h valid token with userId, companyId and isAdmin
*/
exports.login = async (req, res) => {

    // RECEIVE VARIABLES - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // If no validation errors, get the req.body objects that were validated and are needed
    const { email, password } = req.body

    // GET USER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // We search the database to verify if the email exists, skipTenant to check ALL instances
    const [errUser, user] = await to(User.findOne({ email }))
    if (errUser) {
        // Create the error message, and context of the error
        const message = req.polyglot.t('500-findUser')

        // Log the error
        errorLogger(message, req.url, "User.findOne", req.method, errUser)

        // Send the error message to the user
        return res.status(500).send({ auth: 'unknown', message })
    }
    // VALIDATE USER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    if (!user) { // If the user doesn't exist or is disabled, fail auth
        return res.status(401).send({ auth: false, message: req.polyglot.t('401-failedAuth'), token: null })
    }

    // COMPARE PWD - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    const [errPwd, passwordIsValid] = await to(bcrypt.compare(password, user.hash))
    if (errPwd) {
        // Create the error message, and context of the error
        const message = req.polyglot.t('500-verifyPass')

        // Log the error
        errorLogger(message, req.url, "bcrypt.compare", req.method, errPwd)

        // Send the error message to the user
        return res.status(500).send({ auth: 'unknown', message })
    }
    if (!passwordIsValid) { // Invalid password should just fail auth, do not give clues
        return res.status(401).send({ auth: false, message: req.polyglot.t('401-failedAuth'), token: null })
    }

    // CREATE TOKEN & RESPOND - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    const token = createJWT({ userId: user._id, userIsAdmin: user.isAdmin }, { expiresIn: '12h' })
    return res.status(200).send({ auth: true, message: req.polyglot.t('200-auth'), token: token })
}

/*
* Forgot Password function
* Receives an email
* Validation errors send status 400, no auth errors status 200 (to not filter info), server errors status 500
* Returns, if user exists, same status 200 but send an email with a 30min valid token without data
*/
exports.forgotPassword = async (req, res) => {

    // RECEIVE VARIABLES - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // If no validation errors, get the req.body objects that were validated and are needed
    const { email } = req.body

    // GET USER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // We search the database to verify if the email exists, skipTenant to check ALL instances
    const [errUser, user] = await to(User.findOne({ email }))
    if (errUser) {
        // Create the error message, and context of the error
        const message = req.polyglot.t('500-findUser')

        // Log the error
        errorLogger(message, req.url, "User.findOne", req.method, errUser)

        // Send the error message to the user
        return res.status(500).send({ auth: 'unknown', message })
    }
    // VALIDATE USER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    if (!user || !user.isEnabled) { // If the user doesn't exist or is disabled, fail auth but don't tell
        return res.status(200).send({ auth: 'unknown', message: req.polyglot.t('200-ifEmailExists'), token: undefined })
    }

    // ADD TEMPTOKEN TO USER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // If the user exists, and isEnabled, create the token & expiry and set them to user, then save
    const tempToken = crypto.randomBytes(20).toString('hex')
    const tempTokenExpiry = moment().add(30, 'minutes')

    user.tempToken = tempToken
    user.tempTokenExpiry = tempTokenExpiry

    const [errUserSave, updatedUser] = await to(user.save())
    if (errUserSave) {
        // Create the error message, and context of the error
        const message = req.polyglot.t('500-updateUserTempToken')

        // Log the error
        errorLogger(message, req.url, "user.save", req.method, errUserSave)

        // Send the error message to the user
        return res.status(500).send({ auth: 'unknown', message })
    }

    // CONSTRUCT & SEND EMAIL - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // Set the user context and construct the URL to grant access to the user
    const userEmail = updatedUser.email
    const userToken = updatedUser.tempToken
    const URL = process.env.APP_URL + '/api/forgot-password/' + userEmail + '/' + userToken

    const [errEmail, mail] = await to(mailer.emailforgotPwd(userEmail, URL))
    if (errEmail) {
        // Create the error message, and context of the error
        const message = req.polyglot.t('500-sendEmail')

        // Log the error
        errorLogger(message, req.url, "mailer.emailforgotPwd", req.method, errEmail)

        // Send the error message to the user
        return res.status(500).send({ auth: 'unknown', message })
    }
    console.log(`emailforgotPwd sent, generated temp token: ${user.tempToken}`)

    // RESPOND - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    return res.status(200).send({ auth: 'unknown', message: req.polyglot.t('200-ifEmailExists'), token: undefined })
}

/*
* Forgot Password Login function
* Receives an email and a tempToken to validate
* Validation errors send status 400, no auth errors status 401, server errors status 500
* Returns if user exists, same status 200 but send an email with a 30min valid token without data
*/
exports.forgotPasswordLogin = async (req, res) => {

    // RECEIVE VARIABLES - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // If no validation errors, get the req.params objects that were validated and are needed
    const { email, tempToken } = req.params
    const currDate = moment()

    // GET USER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // We search the database to verify if the email exists, skipTenant to check ALL instances
    const [errUser, user] = await to(User.findOne({ email }))
    if (errUser) {
        // Create the error message, and context of the error
        const message = req.polyglot.t('500-findUser')

        // Log the error
        errorLogger(message, req.url, "User.findOne", req.method, errUser)

        // Send the error message to the user
        return res.status(500).send({ auth: 'unknown', message })
    }

    // VALIDATE USER & TOKEN - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // If the user doesn't exist or is disabled, fail auth
    if (!user || !user.isEnabled) {
        return res.status(401).send({ auth: false, message: req.polyglot.t('401-failedAuth'), token: null })
    }

    // Check the expiration of the token
    if (currDate > user.tempTokenExpiry) {
        return res.status(401).send({ auth: false, message: req.polyglot.t('401-invalidToken'), token: null })
    }

    // Check if tokens don't match
    if (tempToken != user.tempToken) {
        return res.status(401).send({ auth: false, message: req.polyglot.t('401-invalidToken'), token: null })
    }

    // CREATE TOKEN - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // If token is valid, create and send a token with userId, companyId and isAdmin status
    const token = createJWT({ userId: user._id, userIsAdmin: user.isAdmin }, { expiresIn: '12h' })

    // RESPOND - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    return res.status(200).send({ auth: true, message: req.polyglot.t('200-auth'), token: token })
}