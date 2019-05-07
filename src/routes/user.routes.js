import {
    postUser,
    putUser,
    getUsers,
    getUser
} from '../controllers/user.controller'

// Routes =============================================================
module.exports = (router, verifyJWT) => {

    // POST route for creating a new user
    router.post("/api/users", verifyJWT, postUser)

    // PUT route for updating your user, it may or may not receive params
    router.put("/api/users/:userId", verifyJWT, putUser)

    // GET route for getting all of the users
    router.get("/api/users", verifyJWT, getUsers)

    // GET route for getting one of the users
    router.get("/api/users/:userId", verifyJWT, getUser)

}