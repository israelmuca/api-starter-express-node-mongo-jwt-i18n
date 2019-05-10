import { check } from 'express-validator/check'

/*
* Function to validate the user's input before passing it to the controller's functions
* Receives the function to validate for
* Validates the input using express-validator
* Returns the actual validations in the req, to be used later in the chain of functions
*/
exports.validator = functionName => {

    switch (functionName) {

        case 'login': {
            return [
                check('email')
                    .exists().withMessage('emailRequiredField')
                    .isEmail().withMessage('emailIsEmail'),
            
                check('password')
                    .exists().withMessage('passwordRequiredField')
            ]
        }

        case 'forgotPassword': {
            return [
                check('email')
                    .exists().withMessage('emailRequiredField')
                    .isEmail().withMessage('emailIsEmail')
            ]
        }

        case 'forgotPasswordLogin': {
            return [
                check('email')
                    .exists().withMessage('emailRequiredParam')
                    .isEmail().withMessage('emailIsEmail'),
                
                check('tempToken')
                    .exists().withMessage('tempTokenRequiredParam')
                    .isHexadecimal().withMessage('tempTokenIsHex')
            ]
        }
    }
}