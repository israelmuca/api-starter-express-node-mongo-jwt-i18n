import chai from 'chai'
import chaiHttp from 'chai-http'
import { fakeLogin, rootUserLogin, adminUser, nonAdminUser } from './data/data.test'

chai.use(chaiHttp)

const expect = chai.expect
const url = 'http://localhost:8080'

let rootToken
let nonAdminToken

// Auth   =============================================================
describe('Auth: ', () => {

    it('should fail login', done => {
        chai.request(url)
            .post('/api/login')
            .send(fakeLogin)
            .end((err, res) => {
                expect(res).to.have.status(401)
                done()
            })
    })

    it('should successfully login', done => {
        chai.request(url)
            .post('/api/login')
            .send(rootUserLogin)
            .end((err, res) => {
                expect(res).to.have.status(200)

                // Save root token for future test
                rootToken = res.body.token
                done()
            })
    })

})

// User   =============================================================
describe('Users:', () => {

    it('should create an admin user', done => {
        chai.request(url)
            .post('/api/users')
            .set('authorization', 'Bearer ' + rootToken)
            .send(adminUser)
            .end((err, res) => {
                expect(res).to.have.status(200)
                done()
            })
    })

    it('should create a non admin user', done => {
        chai.request(url)
            .post('/api/users')
            .set('authorization', 'Bearer ' + rootToken)
            .send(nonAdminUser)
            .end((err, res) => {
                expect(res).to.have.status(200)
                nonAdminToken = res.body.token
                done()
            })
    })

    it('should fail to create a user because non-admin user token is used', done => {
        chai.request(url)
            .post('/api/users')
            .set('authorization', 'Bearer ' + nonAdminToken)
            .send(nonAdminUser)
            .end((err, res) => {
                expect(res).to.have.status(403)
                done()
            })
    })

})