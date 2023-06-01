const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let validStrings = require('../controllers/puzzle-Strings.js').puzzlesAndSolutions
let invalidString1 = '1.5..2.84..63.12.7.2..5..L..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
let invalidString2 = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....92691'

let failureString1 = '..8..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
let failrueString2 = '1.1..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'

suite('Functional Tests', () => {
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done) {
        chai.request(server)
        .post('/api/solve')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ puzzle: validStrings[0][0] })
        .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.solution, validStrings[0][1])
            done();
        })
    })
    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function(done) {
        chai.request(server)
        .post('/api/solve')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send()
        .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.error, 'Required field missing')
            done();
        })
    })
    test('Solve a puzzle with invalid characters: POST request to /api/solve', function(done) {
        chai.request(server)
        .post('/api/solve')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ puzzle: invalidString1 })
        .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.error, 'Invalid characters in puzzle')
            done();
        })
    })
    test('Solve a puzzle with incorrect length: POST request to /api/solve', function(done) {
        chai.request(server)
        .post('/api/solve')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ puzzle: invalidString2 })
        .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
            done();
        })       
    })
    test('Solve a puzzle that cannot be solved: POST request to /api/solve', function(done) {
        chai.request(server)
        .post('/api/solve')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ puzzle: failrueString2 })
        .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.error, 'Puzzle cannot be solved')
            done();
        })   
    })
    test('Check a puzzle placement with all fields: POST request to /api/check', function(done) {
        chai.request(server)
        .post('/api/check')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({puzzle: validStrings[0][0], coordinate: 'A2', value: 3})
        .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.valid, true)
            done();
        })   
    })
    test('Check a puzzle placement with single placement conflict: POST request to /api/check', function(done) {
        chai.request(server)
        .post('/api/check')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({puzzle: validStrings[0][0], coordinate: 'A2', value: 7})
        .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.valid, false)
            assert.deepEqual(res.body.conflict, ['column'])
            done();
        })
    })
    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function(done) {
        chai.request(server)
        .post('/api/check')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({puzzle: validStrings[0][0], coordinate: 'A2', value: 5})
        .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.valid, false)
            assert.deepEqual(res.body.conflict, ['row', 'region'])
            done();
        })
    })
    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function(done) {
        chai.request(server)
        .post('/api/check')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({puzzle: validStrings[0][0], coordinate: 'A2', value: 2})
        .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.valid, false)
            assert.deepEqual(res.body.conflict, ['row', 'column', 'region'])
            done();
        })
    })
    test('Check a puzzle placement with missing required fields: POST request to /api/check', function(done) {
        chai.request(server)
        .post('/api/check')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({puzzle: validStrings[0][0], coordinate: 'A2'})
        .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.error, 'Required field(s) missing')
            done();
        })
    })
    test('Check a puzzle placement with invalid characters: POST request to /api/check', function(done) {
        chai.request(server)
        .post('/api/check')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({puzzle: invalidString1, coordinate: 'A2', value: 2})
        .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.error, 'Invalid characters in puzzle')
            done();
        })
    })
    test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done) {
        chai.request(server)
        .post('/api/check')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({puzzle: invalidString2, coordinate: 'A2', value: 2})
        .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
            done();
        })
    })
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done) {
        chai.request(server)
        .post('/api/check')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({puzzle: validStrings[0][0], coordinate: 'A0', value: 2})
        .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.error, 'Invalid coordinate')
            done();
        })
    })
    test('Check a puzzle placement with invalid placement value: POST request to /api/check', function(done) {
        chai.request(server)
        .post('/api/check')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({puzzle: validStrings[0][0], coordinate: 'A2', value: 15})
        .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.error, 'Invalid value')
            done();
        })
    })
});

