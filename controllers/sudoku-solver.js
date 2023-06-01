class SudokuSolver {
  constructor() {
    this.solution = ''
  }

  validate(puzzleString) {
    if(puzzleString.length != 81){
      return { error: 'Expected puzzle to be 81 characters long' }
    }


    if(/^[1-9.]*$/.test(puzzleString)){
      return 'puzzle is valid'
    } else {
      return { error: 'Invalid characters in puzzle' } 
    }
  }

  checkRowPlacement(puzzleString, row, value) {
    let thisRow = puzzleString.slice(9*row, 9*row+9)
    if(thisRow.includes(value)){
      return false
    } else {
      return true
    }
  }

  checkColPlacement(puzzleString, column, value) {
    let thisColumn = ''
    for (let i = column; i<=(81-(9-column)); i+=9){
      thisColumn += puzzleString[i]
    }
    if(thisColumn.includes(value.toString())){
      return false
    } else {
      return true
    }
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let start_index = (9*(row - (row%3))) + (column - (column%3))

    let region = ''
    for (let i = 0; i<3; i++){
      region += puzzleString.slice(start_index + (i*9), start_index + (i*9) + 3)
    }

    if(region.includes(value.toString())){
      return false
    } else {
      return true
    }
  }

  changeBox(string, index, val){
    return string.slice(0, index) + val + string.slice(index+1, 81)
  }

  checkAll(puzzleString, row, column, value) {
    let checkString = puzzleString
    let index = row*9+column
    if(puzzleString[index] === value.toString()){
      checkString = this.changeBox(checkString, index, '.')
    }

    let conflicts = []
    if(!this.checkRowPlacement(checkString, row, value)){
      conflicts.push('row')
    }
    if(!this.checkColPlacement(checkString, column, value)) {
      conflicts.push('column')
    }
    if(!this.checkRegionPlacement(checkString, row, column, value)){
      conflicts.push('region')
    }

    if(conflicts.length === 0){
      return { valid: true }
    } else {
      return { valid: false, conflict: conflicts}
    }
  }

  backtrackingSolver(puzzleString){
    let currentBoard = puzzleString

    for (let index = 0; index<81; index++){
      let char = currentBoard[index]
      let row = Math.floor(index/9)
      let column = index%9
      if(char !== '.'){
        if(!this.checkAll(currentBoard, row, column, parseInt(char)).valid){
          return false
        }
        if(index === 80){
          this.solution = currentBoard
          return true
        }
      }
      if(char === '.'){
        for(let val=1; val<=9; val++){
          if(this.checkAll(currentBoard, row, column, val).valid){
            currentBoard = this.changeBox(currentBoard, index, val.toString())
            if(this.backtrackingSolver(currentBoard)){
              return true
            }
            currentBoard = this.changeBox(currentBoard, index, '.')
          }
        }
        return false
      }
    }

    return false
  }

  solve(puzzleString) {
    //using the backtracking solution for now. If I wanted to speed it up I would add in actual sudoku solving algos
    if(this.backtrackingSolver(puzzleString)){
      return this.solution
    } else {
      return 'error'
    }
  }
}

module.exports = SudokuSolver;

