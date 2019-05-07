import express from 'express'
import bodyParser from 'body-parser'
import mongoose  from 'mongoose'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from './config/env'
import { verifyJWT } from './utilities/createVerifyJWT'
import { bindCurrentNamespace } from './utilities/getSetContext'

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

// Connect to the Mongo DB
mongoose.connect(process.env.MONGOOSE_DB, { useNewUrlParser: true })

// Routes
// =============================================================

// Non-protected
require("./routes/auth.routes")(router)

// Protected
require("./routes/user.routes")(router, verifyJWT)
/* require("./routes/company.routes")(router, verifyJWT)
require("./routes/location.routes")(router, verifyJWT)
require("./routes/customer.routes")(router, verifyJWT)
require("./routes/ticket.routes")(router, verifyJWT)
require("./routes/payment.routes")(router, verifyJWT)
require("./routes/email.routes")(router, verifyJWT) */

// 404 Catch-all
router.use((req, res) => res.status(404).send({ auth: 'unknown', message: 'This is an incorrect endpoint' }))

// Start the server!
// =============================================================
router.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}`) 
})