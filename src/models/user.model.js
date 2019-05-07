import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

// Define how many salt rounds should be done, 12 is ok
const saltRounds = 12

const UserSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phoneNumber: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    hash: String,
    tempToken: String,
    tempTokenExpiry: Date
}, { timestamps: true })

UserSchema.set('toObject', { virtuals: true })
UserSchema.set('toJSON', { virtuals: true })

// SAVE - Pre hook to create hashed pwd
UserSchema.pre('save', function (next) {
    bcrypt.hash(this.hash, saltRounds)
        .then(hash => {
            this.hash = hash
            next()
        })
        .catch(err => {
            next(err)
        })
})

// UPDATE - Pre hook to create hashed pwd
UserSchema.pre('findOneAndUpdate', function (next) {
    bcrypt.hash(this._update.hash, saltRounds)
        .then(hash => {
            this._update.hash = hash
            next()
        })
        .catch(err => {
            next(err)
        })
})

export default mongoose.model("User", UserSchema)