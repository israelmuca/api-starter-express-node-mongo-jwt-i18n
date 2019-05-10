export const availableLangs = ['es', 'en']
export const messages = {
    es: {
        // HTTP messages =============================================================

                // Generic
            '200-auth': 'Autenticación exitosa.',
            '404': ' no existe o espera otro método HTTP.',
    
                // User
            '200-userCreated': 'El usuario fue creado exitosamente.',
            '200-userUpdated': 'El usuario fue actualizado exitosamente.',
            '200-userFound': 'El usuario fue encontrado exitosamente.',
            '200-usersFound': 'Los usuarios fueron encontrados exitosamente.',
            '403-onlyAdminsCreateUser': 'Falló la autenticación, solo los administradores pueden crear usuarios.',
            '403-onlyAdminsModUser': "Falló la autenticación, solo los administradores pueden cambiar los datos de usuarios.",
            '500-findUser': 'Hubo un error al buscar al usuario.',
            '500-findUsers': 'Hubo un error al buscar a los usuarios.',
            '500-createUser': 'Hubo un error al crear al usuario.',
            '500-updateUser': 'Hubo un error al actualizar al usuario.',
            
                // Auth
            '401-failedAuth': 'Falló la autenticación.',
            '401-invalidToken': 'El token ya no es válido, por favor crea otro.',
            '500-verifyPass': 'Hubo un error al verificar la contraseña.',
            '500-updateUserTempToken': 'Hubo un error al actualizar al usuario con el token de acceso temporal.',
            '500-findCompanyTempToken': 'Hubo un error al buscar la compañía para enviar el token de acceso temporal, por favor intenta de nuevo.',
    
    
        // Validator messages =============================================================
    
                // Auth
            'passwordRequiredField': "'password' es un campo requerido.",
            'tempTokenRequiredParam': "'tempToken' es un parámetro requerido.",
            'tempTokenIsHex': "Este no es un token válido.",
    
    
                // Repeated
            'emailRequiredField': "'email' es un campo requerido.",
            'emailRequiredParam': "'email' es un parámetro requerido.",
            'emailIsEmail': "No es un email válido.",
            'emailIsUnique': "Este email ya está en uso.",
            'phoneNumberRequiredField': "'phoneNumber' es un campo requerido.",
            'phoneNumberIsLength': "El campo 'phoneNumber' no debe superar los 15 caracteres.",
            'phoneNumberIsNumeric': "'phoneNumber' solo puede ser numérico.",
            'textIsRequiredField': "'text' es un campo requerido.",
            'textIsLength': "El campo 'text' no debe superar los 1000 caracteres.",
            'isEnabledIsBoolean': "'isEnabled' debe ser de tipo Boolean.",
    
                // User
            'userIdRequiredParam': "'userId' es un parámetro requerido.",
            'userIdIsMongoId': "'userId' no es un ID válido.",
            'fullName': "'fullName' es un campo requerido.",
            'fullNameIsLength': "El campo 'fullName' no debe superar los 60 caracteres.",
            'passwordRequiredField': "'password' es un campo requerido.",
            'passwordConfirmRequiredField': "'passwordConfirm' es un campo requerido",
            'passwordConfirmIsMatch': 'La confirmación de la contraseña no coincide con la contraseña.',
            'birthDateIsISO': "'birthDate' debe ser tener un formato de fecha ISO 8601 válido.",
            'homeAddressIsLength': "El campo 'homeAddress' no debe superar los 240 caracteres.",
            'isAdminIsBoolean': "'isAdmin' debe ser de tipo Boolean."
    
    },
    en: {
    // HTTP messages =============================================================

            // Generic
        '200-auth': 'Successful authentication.',
        '404': ' does not exist or expects another HTTP method.',

            // User
        '200-userCreated': 'User successfuly created.',
        '200-userUpdated': 'User successfuly updated.',
        '200-userFound': 'User successfuly found.',
        '200-usersFound': 'Users successfuly found.',
        '403-onlyAdminsCreateUser': 'Failed authentication, only administrators can create users.',
        '403-onlyAdminsModUser': "Failed authentication, only administrators can change user's data.",
        '500-findUser': 'There was an error finding the user.',
        '500-findUsers': 'There was an error finding the users.',
        '500-createUser': 'There was an error creating the user.',
        '500-updateUser': 'There was an error updating the user.',

            // Auth
        '401-failedAuth': 'Failed authenticaton.',
        '401-invalidToken': 'The token is no longer valid, please create another.',
        '500-verifyPass': 'There was an error verifying the password.',
        '500-updateUserTempToken': 'There was an error updating the user with a temporary access token.',
        '500-findCompanyTempToken': 'There was an error finding the company to send the temporary access token, please try again.',


    // Validator messages =============================================================

            // Auth
        'passwordRequiredField': "'password' is a required field.",
        'tempTokenRequiredParam': "'tempToken' is a required parameter.",
        'tempTokenIsHex': "This is not a valid token.",

            // Repeated
        'emailRequiredField': "'email' is a required field.",
        'emailRequiredParam': "'email' is a required parameter.",
        'emailIsEmail': "This is not a valid email address.",
        'emailIsUnique': "This email is already in use.",
        'phoneNumberRequiredField': "'phoneNumber' is a required field.",
        'phoneNumberIsLength': "The length of 'phoneNumber' cannot exceed 15 characters.",
        'phoneNumberIsNumeric': "'phoneNumber' can only be numeric.",
        'textIsRequiredField': "'text' is a required field.",
        'textIsLength': "The length of 'text' cannot exceed 1000 characters.",
        'isEnabledIsBoolean': "'isEnabled' must be a Boolean.",

            // User
        'userIdRequiredParam': "'userId' is a required parameter.",
        'userIdIsMongoId': "'userId' is not a valid ID.",
        'fullName': "'fullName' is a required field.",
        'fullNameIsLength': "The length of 'fullName' cannot exceed 60 characters.",
        'passwordRequiredField': "'password' is a required field.",
        'passwordConfirmRequiredField': "'passwordConfirm' is a required field",
        'passwordConfirmIsMatch': 'Password confirmation does not match password.',
        'birthDateIsISO': "'birthDate' must be formatted as a valid ISO 8601 date.",
        'homeAddressIsLength': "The length of 'homeAddress' cannot exceed 240 characters.",
        'isAdminIsBoolean': "'isAdmin' must be a Boolean."

    }
}