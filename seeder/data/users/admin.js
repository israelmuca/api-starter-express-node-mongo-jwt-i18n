const { hashPwd } = require('../../helpers/helpers')

module.exports = {
    fullName: "Root User",
    email: "root@api-starter.com.mx",
    hash: hashPwd('1234567890'),
    phoneNumber: "123456",
    isAdmin: true
}