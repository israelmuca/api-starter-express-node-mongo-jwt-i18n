import chai from 'chai'
import { messages } from '../src/i18n/i18n'
import { errUser } from './data/data.test'

const expect = chai.expect
const url = 'http://localhost:8080'

// Tests all possible translation problems
describe('Translations: ', () => {

    it("should pass if the 'es' and 'en' objects have the same keys", done => {
        expect(Object.keys(messages.es)).to.have.all.members(Object.keys(messages.en))
        done()
    })

    /* it("should pass if an spanish message is returned when es_MX headers are sent", done => {
        chai.request(url)
        .post('/api/companies')
        .set('Accept-Language', 'es_MX')
        .send(errCompany)
        .end((err, res) => {
            expect(res.body.commercialName.msg).to.be.equal("'commercialName' es un campo requerido.")
            done()
        })
    })

    it("should pass if an english message is returned when en_US headers are sent", done => {
        chai.request(url)
        .post('/api/companies')
        .set('Accept-Language', 'en_US')
        .send(errCompany)
        .end((err, res) => {
            expect(res.body.commercialName.msg).to.be.equal("'commercialName' is a required field.")
            done()
        })
    }) */

})