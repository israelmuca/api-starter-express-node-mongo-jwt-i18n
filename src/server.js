import express from 'express'
import bodyParser from 'body-parser'
import mongoose  from 'mongoose'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from './config/env'
import { verifyJWT } from './utilities/createVerifyJWT'
import { bindCurrentNamespace } from './utilities/getSetContext'
import createLocaleMiddleware from 'express-locale'
import { startPolyglot } from './utilities/startPolyglotLocale'

// Set up the Express Router
// =============================================================
const router = express()

// Add security with helmet
router.use(helmet())

// Use morgan to log the requests on the terminal
router.use(morgan(process.env.APP_ENV))

// Add data parsing to express
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

// Create a namespace for context
router.use(bindCurrentNamespace)

// Get the locale in the header
router.use(createLocaleMiddleware({
    "priority": ["accept-language", "default"],
    "default": "en_US"
}))

// Start polyglot and set the language in the req with the phrases to be used
router.use(startPolyglot)

// Connect to the Mongo DB
mongoose.connect(process.env.MONGOOSE_DB, { useNewUrlParser: true })

// Routes
// =============================================================

// Non-protected
require("./routes/auth.routes")(router)

// Protected
require("./routes/user.routes")(router, verifyJWT)

// 404 Catch-all
router.use((req, res) => res.status(404).send({ auth: 'unknown', message: req.url+req.polyglot.t('404') }))

// Start the server!
// =============================================================
router.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}`) 
})