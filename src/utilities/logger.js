import fs from 'fs'
import { getCurrentUserId, getCurrentCompanyId } from './getSetContext'

// Create a fs write stream to append the errors
const error = fs.createWriteStream('./logs/error.txt')

/*
* Function to do the actual logging
* Receives the payload to save (includes companyId and more)
* Needs context
* Server errors status 500
* Returns, status 200 & the tickets
*/
exports.errorLogger = (message, url, func, verb, err) => {
    
    // Set the context of the user
    const userId = getCurrentUserId()

    // Form the actual line that will be added
    const newLogLine =
`\nDate: ${new Date().toISOString()}
User: ${userId}
Verb: ${verb}
Message: ${message}
URL: ${url}
Function: ${func}
Error: ${err}
---------------------------`

    // Send to the .txt
    error.write(newLogLine)
}