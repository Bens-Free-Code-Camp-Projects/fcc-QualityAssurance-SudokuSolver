'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  let validRows = 'ABCDEFGHI'
  app.route('/api/check')
    .post((req, res) => {
      if(!req.body.puzzle || !req.body.coordinate || !req.body.value) {
        res.json({error: 'Required field(s) missing'})
        return
      }

      let puzzle = req.body.puzzle
      let isValid = solver.validate(puzzle)
      if(isValid !== 'puzzle is valid'){
        res.json(isValid)
        return
      }

      let row = validRows.indexOf(req.body.coordinate[0])
      let column = parseInt(req.body.coordinate[1]) - 1

      if(row === -1 || column === NaN || column > 8 || column < 0 || req.body.coordinate.length > 2) {
        res.json({ error: 'Invalid coordinate'})
        return
      }

      let value = parseInt(req.body.value)
      if(value === NaN || value>9 || value<1){
        res.json({error: 'Invalid value'})
        return
      }

      res.json(solver.checkAll(puzzle, row, column, value))
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle
      if(!puzzle) {
        res.json({error: 'Required field missing'})
      }
      let isValid = solver.validate(puzzle)
      if(isValid !== 'puzzle is valid'){
        res.json(isValid)
        return
      }


      let solved = solver.solve(puzzle)

      if(solved === 'error'){
        res.json({ error: 'Puzzle cannot be solved' })
      } else {
        res.json({ solution: solved})
      }
    });
};
