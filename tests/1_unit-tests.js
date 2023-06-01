const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

let validStrings = require('../controllers/puzzle-Strings.js').puzzlesAndSolutions
let invalidString1 = '1.5..2.84..63.12.7.2..5..L..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
let invalidString2 = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....92691'

let failureString1 = '..8..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
let failrueString2 = '1.1..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'

suite('Unit Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', function() {
        assert.equal(solver.validate(validStrings[0][0]), 'puzzle is valid')
    })
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function() {
        assert.deepEqual(solver.validate(invalidString1), { error: 'Invalid characters in puzzle' })
    })
    test('Logic handles a puzzle string that is not 81 characters in length', function() {
        assert.deepEqual(solver.validate(invalidString2), { error: 'Expected puzzle to be 81 characters long' })
    })
    test('Logic handles a valid row placement', function() {
        assert.isTrue(solver.checkRowPlacement(validStrings[0][0], 0, 7))
    })
    test('Logic handles an invalid row placement', function() {
        assert.isNotTrue(solver.checkRowPlacement(validStrings[0][0], 0, 8))
    })
    test('Logic handles a valid column placement', function() {
        assert.isTrue(solver.checkColPlacement(validStrings[0][0], 1, 4))
    })
    test('Logic handles an invalid column placement', function() {
        assert.isNotTrue(solver.checkColPlacement(validStrings[0][0], 1, 7))
    })
    test('Logic handles a valid region (3x3 grid) placement', function() {
        assert.isTrue(solver.checkRegionPlacement(validStrings[0][0], 1, 1, 9))
    })
    test('Logic handles an invalid region (3x3 grid) placement', function() {
        assert.isNotTrue(solver.checkRegionPlacement(validStrings[0][0], 1, 1, 2))
    })
    test('Valid puzzle strings pass the solver', function() {
        assert.isTrue(solver.backtrackingSolver(validStrings[0][0]))
        assert.isTrue(solver.backtrackingSolver(validStrings[1][0]))
        assert.isTrue(solver.backtrackingSolver(validStrings[2][0]))
    })
    test('Invalid puzzle strings fail the solver', function() {
        assert.equal(solver.solve(failureString1), 'error')
        assert.equal(solver.solve(failrueString2), 'error')
    })
    test('Solver returns the expected solution for an incomplete puzzle', function() {
        assert.equal(solver.solve(validStrings[0][0]), validStrings[0][1])
        assert.equal(solver.solve(validStrings[1][0]), validStrings[1][1])
        assert.equal(solver.solve(validStrings[2][0]), validStrings[2][1])
    })
});
