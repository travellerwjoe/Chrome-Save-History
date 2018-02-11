const chai = require('chai')
const request = require('supertest')
const app = require('../src')
const History = require('../src/db/Model/history')

const expect = chai.expect

describe('Api Test', () => {
    describe('POST /history/insert', () => {
        const data = {
            id: "54994",
            lastVisitTime: 1516848899855.781,
            title: "visionmedia/superagent: Ajax with less suck - (and node.js HTTP client to match)",
            typedCount: 0,
            url: "https://github.com/visionmedia/superagent",
            visitCount: 2
        }

        let insertedData

        /**
         * 接口应该返回code：200,action:true
         */
        it('should return code 200 and action true', (done) => {
            request(app.listen())
                .post('/history/insert')
                .send(data)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err)
                    const body = res.body
                    expect(body.code).to.equal(200)
                    expect(body.action).to.be.true
                    expect(body).to.have.property('data')
                    insertedData = body.data
                    done()
                })
        })

        /**
         * 接口应该插入或更新一条集合history的记录
         */
        it('should upsert a history record to mongodb', done => {
            History
                .findOne({
                    id: insertedData.id
                })
                .exec((err, doc) => {
                    if (err) return done(err)
                    expect(doc).to.not.be.null
                    expect(JSON.stringify(insertedData)).to.equal(JSON.stringify(doc))
                    done()
                })

        })
    })

    describe('POST /history', () => {
        /**
         * 应该返回没有条件的第一页的历史记录列表数据
         */
        it('should return the history record list on first page without conditions', done => {
            request(app.listen())
                .post('/history')
                .send({})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err)
                    const body = res.body
                    expect(body.code).to.equal(200)
                    expect(body.action).to.be.true
                    expect(body).to.have.property('data')
                    expect(body.data).to.be.an('array')
                    done()
                })
        })
    })
})