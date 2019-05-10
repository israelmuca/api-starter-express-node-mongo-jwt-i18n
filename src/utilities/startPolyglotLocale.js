import Polyglot from 'node-polyglot'
import { messages } from '../i18n/i18n'

/* 
* Sets the phrases to be used for every req and res
* Receives the regular express req, res, next
* Sets req.plyglot with the phrases for the current locale
* Returns nothing, it calls next() to continue forward
*/
exports.startPolyglot = (req, res, next) => {
    
    // Get the locale from express-locale
    const locale = req.locale.language

    // Start Polyglot and add it to the req
    req.polyglot = new Polyglot()

    // Decide which phrases for polyglot
    if (locale == 'es') {
        req.polyglot.extend(messages.es)
    } else {
        req.polyglot.extend(messages.en)
    }

    next()
}