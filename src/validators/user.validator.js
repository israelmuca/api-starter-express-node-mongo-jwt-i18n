import { check } from 'express-validator/check'
import User from '../models/user.model'

/*
* Function to validate the user's input before passing it to the controller's functions
* Receives the function to validate for
* Validates the input using express-validator
* Returns the actual validations in the req, to be used later in the chain of functions
*/
exports.validator = functionName => {

    switch (functionName) {

        case 'postUser': {
            return [
                check('fullName')
                    .exists().withMessage('fullName')
                    .isLength({ min: 1, max: 60 }).withMessage('fullNameIsLength')
                    .trim()
                    .escape(),

                check('email')
                    .exists().withMessage('emailRequiredField')
                    .isEmail().withMessage('emailIsEmail')
                    .custom(email => {
                        // Verify if there's another user with the same email
                        return User({ skipTenant: true }).findOne({ email }).then(user => {
                            if (user) {
                                if (user.email === email) { // Added this to fix a weird error
                                    return Promise.reject('emailIsUnique')
                                }
                            }
                        })
                    }),
                
                check('password')
                    .exists().withMessage('passwordRequiredField'),

                check('passwordConfirm')
                    .exists().withMessage('passwordConfirmRequiredField')
                    .custom((passwordConfirm, { req }) => {
                        if (passwordConfirm !== req.body.password) {
                            throw new Error('passwordConfirmIsMatch')
                        } else {
                            return true
                        }
                    }),
                
                check('birthDate')
                    .optional()
                    .isISO8601().withMessage('birthDateIsISO'),

                check('homeAddress')
                    .optional()
                    .isLength({ min: 1, max: 240 }).withMessage('homeAddressIsLength')
                    .trim()
                    .escape(),
                
                check('phoneNumber')
                    .optional()
                    .isLength({ min: 1, max: 15 }).withMessage('phoneNumberIsLength')
                    .isNumeric().withMessage('phoneNumberIsNumeric')
                    .trim(),

                check('isAdmin')
                    .optional()
                    .isBoolean().withMessage('isAdminIsBoolean'),
                
                check('address.line1')
                    .optional()
                    .isLength({ min: 1, max: 60 }).withMessage('address.line1IsLength')
                    .trim()
                    .escape(),

                check('address.line2')
                    .optional()
                    .isLength({ min: 1, max: 60 }).withMessage('address.line2IsLength')
                    .trim()
                    .escape(),

                check('address.city')
                    .optional()
                    .isLength({ min: 1, max: 30 }).withMessage('address.cityIsLength')
                    .trim()
                    .escape(),

                check('address.state')
                    .optional()
                    .isLength({ min: 1, max: 30 }).withMessage('address.stateIsLength')
                    .trim()
                    .escape(),

                check('address.zipCode')
                    .optional()
                    .isNumeric().withMessage('address.zipCodeIsNumeric')
                    .trim(),

                check('address.country')
                    .optional()
                    .isLength({ min: 1, max: 60 }).withMessage('address.countryIsLength')
                    .trim()
                    .escape()
            ]
        }

        case 'putUser': {
            return [
                check('fullName')
                    .optional()
                    .isLength({ min: 1, max: 60 }).withMessage('fullNameIsLength')
                    .trim()
                    .escape(),
                
                check('password')
                    .optional(),

                check('passwordConfirm')
                    .optional()
                    .custom((passwordConfirm, { req }) => {
                        if (passwordConfirm !== req.body.password) {
                            throw new Error('passwordConfirmIsMatch')
                        } else {
                            return true
                        }
                    }),
                
                check('birthDate')
                    .optional()
                    .isISO8601().withMessage('birthDateIsISO'),

                check('address.line1')
                    .optional()
                    .isLength({ min: 1, max: 60 }).withMessage('address.line1IsLength')
                    .trim()
                    .escape(),

                check('address.line2')
                    .optional()
                    .isLength({ min: 1, max: 60 }).withMessage('address.line2IsLength')
                    .trim()
                    .escape(),

                check('address.city')
                    .optional()
                    .isLength({ min: 1, max: 30 }).withMessage('address.cityIsLength')
                    .trim()
                    .escape(),

                check('address.state')
                    .optional()
                    .isLength({ min: 1, max: 30 }).withMessage('address.stateIsLength')
                    .trim()
                    .escape(),

                check('address.zipCode')
                    .optional()
                    .isNumeric().withMessage('address.zipCodeIsLength')
                    .trim(),

                check('address.country')
                    .optional()
                    .isLength({ min: 1, max: 60 }).withMessage('address.countryIsLength')
                    .trim()
                    .escape(),

                check('phoneNumber')
                    .optional()
                    .isLength({ min: 1, max: 15 }).withMessage('phoneNumberIsLength')
                    .isNumeric().withMessage('phoneNumberIsNumeric')
                    .trim(),

                check('isAdmin')
                    .optional()
                    .isBoolean().withMessage('isAdminIsBoolean'),

                check('isEnabled')
                    .optional()
                    .isBoolean().withMessage('isEnabledIsBoolean'),
            ]
        }

        case 'getUser': {
            return [
                check('userId')
                    .exists().withMessage('userIdRequiredParam')
                    .isMongoId().withMessage('userIdIsMongoId')
            ]
        }

    }
}