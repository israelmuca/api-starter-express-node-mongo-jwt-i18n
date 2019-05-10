const { hashPwd } = require('../../helpers/helpers')

module.exports = {
    fullName: "Root User",
    email: "root@api-starter.com.mx",
    phoneNumber: "123456",
    isAdmin: true,
    hash: hashPwd('1234567890')
}