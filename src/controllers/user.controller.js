import User from '../models/user.model'
import { createJWT } from '../utilities/createVerifyJWT'
import { getCurrentUserId, getCurrentUserIsAdmin } from '../utilities/getSetContext'
import aqp from 'api-query-params'
import { errorLogger } from '../utilities/logger'
import to from 'await-to-js'


/*
* Function to post a user
* Receives regular req, res from express & body
* Needs context & validation
* Validation errors return status 400, server errors status 500
* Returns status 200 & the created user
*/
exports.postUser = async (req, res) => {

    // RECEIVE VARIABLES - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // Get current company and admin status context
    const isCurrentUserAdmin = getCurrentUserIsAdmin()

    // If no validation errors, get the req.body objects that were validated and are needed
    const { fullName, email, password, phoneNumber, isAdmin } = req.body

    // VALIDATE USER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    if (!isCurrentUserAdmin) {
        return res.status(403).send({ auth: false, message: req.polyglot.t('403-onlyAdminsCreateUser'), token: null })
    }

    // CREATE USER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    const [errNewUser, newUser] = await to(User.create({
        fullName,
        email,
        hash: password,
        phoneNumber,
        isAdmin
    }))
    if (errNewUser) {
        // Create the error message, and context of the error
        const message = req.polyglot.t('500-createUser')

        // Log the error
        errorLogger(message, req.url, "User.create", req.method, errNewUser)

        // Send the error message to the user
        return res.status(500).send({ auth: 'unknown', message })
    }

    // When a new user is created, we'll send a JWT
    // The userId comes from the created user, the company comes from the context
    const userId = newUser._id
    const userIsAdmin = newUser.isAdmin

    const token = createJWT({ userId: userId, userIsAdmin: userIsAdmin }, { expiresIn: '12h' })

    // RESPOND - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    return res.status(200).send({ auth: true, message: req.polyglot.t('200-userCreated'), user: newUser, token: token })
}

/*
* Function to put User
* Receives regular req, res from express, body may or may not have some or all options
* Needs context and isAdmin status
* Validation errors send status 400, auth errors status 403, server errors status 500
* Returns, status 200 & the updated user
*/
exports.putUser = async (req, res) => {

    // RECEIVE VARIABLES - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // If no validation errors, get the req.body & req.params objects that were validated and are needed 
    const { userId } = req.params
    const { fullName, email, password, phoneNumber, isAdmin } = req.body
    // Get current user and admin status context
    const currentUserId = getCurrentUserId()
    const isCurrentUserAdmin = getCurrentUserIsAdmin()

    // CREATE MOD USER DATA - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // Validate the input to make sure that we're not overriding with empty values
    const updatedUser = {}
    if (fullName) { updatedUser.fullName = fullName }
    if (password) { updatedUser.hash = password }
    if (phoneNumber) { updatedUser.phoneNumber = phoneNumber }
    if (isAdmin) { updatedUser.isAdmin = isAdmin }
    if (isEnabled) { updatedUser.isEnabled = isEnabled }

    // If the user initiating the request isAdmin, let change isAdmin field to another user, otherwise, check if user is modifying itself, not auth for anything else
    if (isCurrentUserAdmin) {

        // UPDATE USER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
        // Since the user isAdmin, let user choose userId via params, and modify isAdmin and isEnabled
        const [errUser, mongoUpdatedUser] = await to(User.findByIdAndUpdate(userId, updatedUser, { new: true }))
        if (errUser) {
            // Create the error message, and context of the error
            const message = req.polyglot.t('500-updateUser')

            // Log the error
            errorLogger(message, req.url, "User.findByIdAndUpdate", req.method, errUser)

            // Send the error message to the user
            return res.status(500).send({ auth: 'unknown', message })
        }

        return res.status(200).send({ auth: true, message: req.polyglot.t('200-userUpdated'), user: mongoUpdatedUser })

    } else {

        // Check if the logged in user is changing his own data, if not, return not auth, if yes, proceed
        if (currentUserId != userId) {
            return res.status(403).send({ auth: false, message: req.polyglot.t('403-onlyAdminsModUser'), user: null })
        }

        // UPDATE USER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
        const [errUser, mongoUpdatedUser] = await to(User.findByIdAndUpdate(userId, updatedUser, { new: true }))
        if (errUser) {
            // Create the error message, and context of the error
            const message = req.polyglot.t('500-updateUser')

            // Log the error
            errorLogger(message, req.url, "User.findByIdAndUpdate", req.method, errUser)

            // Send the error message to the user
            return res.status(500).send({ auth: 'unknown', message })
        }

        // RESPOND - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
        return res.status(200).send({ auth: true, message: req.polyglot.t('200-userUpdated'), user: mongoUpdatedUser })
    }

}

/*
* Function to get users
* Receives regular req, res from express, no body
* Needs context, no validation
* Server errors returns status 500
* Returns, status 200 & the users in context
*/
exports.getUsers = async (req, res) => {

    // RECEIVE VARIABLES - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // Get the query parameters from the URL
    const { filter, skip, limit, sort, projection } = aqp(req.query)

    // GET USERS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    const [errUsers, users] = await to(User.find(filter).skip(skip).limit(limit).sort(sort).select(projection))
    if (errUsers) {
        // Create the error message, and context of the error
        const message = req.polyglot.t('500-findUsers')

        // Log the error
        errorLogger(message, req.url, "User.find", req.method, errUsers)

        // Send the error message to the user
        return res.status(500).send({ auth: 'unknown', message })
    }

    // RESPOND - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    return res.status(200).send({ auth: true, message: req.polyglot.t('200-usersFound'), users: users })
}

/*
* Function to get a user
* Receives regular req, res from express and a param
* Needs context & validation
* Validation errors return status 400, server errors status 500
* Returns, status 200 & the user in context
*/
exports.getUser = async (req, res) => {

    // RECEIVE VARIABLES - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // If no validation errors, get the req.params objects that were validated and are needed
    const { userId } = req.params

    // GET USER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    const [errUser, user] = await to(User.findById(userId))
    if (errUser) {
        // Create the error message, and context of the error
        const message = req.polyglot.t('500-findUser')

        // Log the error
        errorLogger(message, req.url, "User.findById", req.method, errUser)

        // Send the error message to the user
        return res.status(500).send({ auth: 'unknown', message })
    }

    // RESPOND - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    return res.status(200).send({ auth: true, message: req.polyglot.t('200-userFound'), user: user })
}