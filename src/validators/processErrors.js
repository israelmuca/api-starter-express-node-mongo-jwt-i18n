import { validationResult } from 'express-validator/check'
import fromEntries from 'object.fromentries'

exports.procErr = (req, res, next) => {
    
    // Verifies if there were validation errors added to the request
    const validationErrors = validationResult(req)

    // If there were errors in the validation
    if (!validationErrors.isEmpty()) {
        // Return the result of the function below
        return res.status(400).send(translateMessages(validationErrors.mapped(), req))
    } else {
        // If no errors, go!
        next()
    }
    
}

/*
* Function to set the error messages to the user's language
* Receives an error obj & express' req
* Does not need context nor auth
* Returns an object where the error messages where replaced by the proper translated err messages
*/
const translateMessages = (errObj, req) => {
    // Convert the errObj to an Array
    const errArr = Object.entries(errObj)
    // For each array(err), compare the error msg with the polyglot phrases, and replace it.
    errArr.forEach(err => {
        Object.keys(req.polyglot.phrases).forEach(phrase => {
            if (phrase == err[1].msg) {
                err[1].msg = req.polyglot.t(phrase)
            }
        })
    })

    // Return a function that converts the Array to an Object
    return fromEntries(errArr)
}