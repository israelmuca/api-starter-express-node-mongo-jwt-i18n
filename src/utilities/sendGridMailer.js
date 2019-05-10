/*
* These functions are provided to send text emails using Send Grid
* They're constructed using async to provide thenables
* They contain all of the logic of emails being sent, including the text
*/
import sgMail from '@sendgrid/mail'

/* 
* Function for forgotten passwords email
* Receives the emailAddress that will receive the email, and the URL for pwd recovery
* Returns either an err or Send Grids confirmation of email sent
*/
exports.emailforgotPwd = async (emailAddress, URL) => {
    try {
        // Set the API Key for SendGrid
        sgMail.setApiKey(process.env.SENDGRID_APIKEY)

        let email

        if (emailLang == 'es') {
            // Construct the email in spanish
            email = {
                from: `support@api-starter-node.com`,
                to: `${emailAddress}`,
                subject: `api-starter: Enlace para reiniciar la contraseña`,
                text:
                    `Usando el enlace a continuación, podrás hacer inicio de sesión en la aplicación.\n\n
                    Por favor cambia tu contraseña inmediatamente.\n\n
                    ${URL}\n\n
                    Si tienes cualquier duda, contacta a soporte.`
            }
        } else {
            // Construct the email in english
            email = {
                from: `support@api-starter-node.com`,
                to: `${emailAddress}`,
                subject: `api-starter: Link to reset password`,
                text:
                    `Using the following link you'll be able to login to the app.\n\n
                    Please change your password immediately.\n\n
                    ${URL}\n\n
                    If you have any questions, contact support.`
            }
        }

        // Send the email
        const emailSent = await sgMail.send(email)
        return emailSent

    }
    catch (err) {
        return err
    }
}