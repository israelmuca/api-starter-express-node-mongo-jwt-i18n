import { login, 
    forgotPassword, 
    forgotPasswordLogin } from '../controllers/auth.controller'

// Routes =============================================================
module.exports = router => {

    // POST route for authenticating an existing user, granting a JWT
    router.post("/api/login", login)

    // POST route for forgotten passwords, setting a temp token and sending an email
    router.post("/api/forgot-password", forgotPassword)

    // GET route for validation of forgotten password tokens
    router.get("/api/forgot-password/:email/:tempToken", forgotPasswordLogin)

}