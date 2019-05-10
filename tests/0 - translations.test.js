import chai from 'chai'
import { messages } from '../src/i18n/i18n'

const expect = chai.expect
const url = 'http://localhost:8080'

// Tests all possible translation problems
describe('Translations: ', () => {

    it("should pass if the 'es' and 'en' objects have the same keys", done => {
        expect(Object.keys(messages.es)).to.have.all.members(Object.keys(messages.en))
        done()
    })

    it("should pass if an spanish message is returned when es_MX headers are sent", done => {
        chai.request(url)
            .post('/api/users')
            .set('Accept-Language', 'es_MX')
            .end((err, res) => {
                expect(res.body.message).to.be.equal('Falló la autenticación.')
                done()
            })
    })

    it("should pass if an english message is returned when en_US headers are sent", done => {
        chai.request(url)
            .post('/api/users')
            .set('Accept-Language', 'en_US')
            .end((err, res) => {
                expect(res.body.message).to.be.equal('Failed authenticaton.')
                done()
            })
    })

})