const bcrypt = require('bcrypt')

exports.hashPwd = pwd => {
    const hash = bcrypt.hashSync(pwd, 12)
    return hash
}