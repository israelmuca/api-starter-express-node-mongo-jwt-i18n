import { validator } from '../validators/auth.validator'
import { procErr } from '../validators/processErrors'
import {
    login,
    forgotPassword,
    forgotPasswordLogin
} from '../controllers/auth.controller'

// Routes =============================================================
module.exports = router => {

    // POST route for authenticating an existing user, granting a JWT
    router.post("/api/login", validator('login'), procErr, login)

    // POST route for forgotten passwords, setting a temp token and sending an email
    router.post("/api/forgot-password", validator('forgotPassword'), procErr, forgotPassword)

    // GET route for validation of forgotten password tokens
    router.get("/api/forgot-password/:email/:tempToken", validator('forgotPasswordLogin'), procErr, forgotPasswordLogin)

}