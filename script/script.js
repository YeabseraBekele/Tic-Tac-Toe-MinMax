/* Now The Fun Begins */

import {Solver} from './AI.js'

const X_MARK = 'x'
const O_MARK = 'o'
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

const newGameBtn = document.getElementById('new-game')
const gameCountLabel = document.getElementById('game-count');
const player1Score = document.getElementById('player-1-score')
const player2Score = document.getElementById('player-2-score')
const board = document.getElementById('board')
const cells = document.querySelectorAll('[data-cell]')
const resultArea = document.getElementById('result-area')
const summaryResultText = document.getElementById('current-result-text')
const resultMessageText = document.getElementById('result-message-text')
const restartGameBtn = document.getElementById('restart')
const resultImage = document.getElementById('result-img'); 
const mode = document.getElementById('mode')

let gameCount = 1;
let xTurn = false;
let computerTurn = true;
let difficultyLevel = 6; 
let isItFirstTimeGame = false;

function restart() {
    xTurn = !xTurn;
    computerTurn = !computerTurn
    removeClassesFrom(board)
    addClassTo(board)
    resultArea.classList.remove('show')
    cells.forEach(cell => {
        cell.classList.remove(X_MARK)
        cell.classList.remove(O_MARK)
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, {
            once: true
        })
    })

    
    cprMarkRandomly()

}

function cprMarkRandomly(){
    if(computerTurn){
        let randomIndex = Math.floor(Math.random()*9) 
        cells[randomIndex].classList.add(O_MARK);
        removeClassesFrom(board)
        addClassTo(board)
        xTurn = !xTurn
    }
}

function startNewGame() {
    if (isItFirstTimeGame)
        if (!confirm('Would you like to play a new game?')) {
            resultArea.classList.add('show')
            return
        }
    summaryResultText.innerHTML = `X= ${player1Score.innerHTML} , O=${player2Score.innerHTML} and Total-Game = ${gameCount-1}`
    isItFirstTimeGame = true
    restart()   
    gameCount = 1
    gameCountLabel.innerHTML = `Game 1-` + tellDifficulty()
    player1Score.innerHTML = 0
    player2Score.innerHTML = 0

}


function tellDifficulty(){
    let text = ""
    if(difficultyLevel==6)text = "Easy"
    else if (difficultyLevel==7)text = "Medium"
    else text = "Hard"
    return text;
}

function toogleDifficulty(){
    if(difficultyLevel==6)difficultyLevel=7
    else if (difficultyLevel==7) difficultyLevel = 9
    else difficultyLevel = 6

    startNewGame();
}

function removeClassesFrom(elementName) {
    elementName.classList.remove(X_MARK)
    elementName.classList.remove(O_MARK)
}

function addClassTo(elementName) {
    elementName.classList.add(X_MARK)
}

function tellTurn() {
    return (xTurn ? 'x' : 'o');
}

function handleClick(e) {
    const cell = e.target
    // mark for human 
    addClassTo(cell)

    if(checkEnd(X_MARK))return;

    
    let solver = new Solver()
    let clonedCells = solver.translateCells(cells);

    
    solver.minmax(clonedCells,true,false,1,difficultyLevel)
    let index = solver.finalResultIndex
    cells[index].classList.add(O_MARK);
    
    clonedCells = solver.translateCells(cells); 
    
    checkEnd(O_MARK) 
    
}


function checkEnd(currentTurn){
    
    if (checkWin(currentTurn)) {
        gameCount += 1
        gameCountLabel.innerHTML = `Game ${gameCount}-`+tellDifficulty()
        let isXsTurn = (currentTurn==X_MARK)

        if (currentTurn === X_MARK) {
            player1Score.innerHTML = parseInt(player1Score.innerHTML) + 1
        } else {
            player2Score.innerHTML = parseInt(player2Score.innerHTML) + 1
        }
        summaryResultText.innerHTML = `X= ${player1Score.innerHTML} , O=${player2Score.innerHTML} and Total-Game = ${gameCount-1}`
        resultMessageText.innerHTML = `${( isXsTurn?"You":"Computer" )} Win`+' <i class="fas fa-trophy"></i> '
        resultArea.classList.add('show') 

        let imgPath = './images/'
        imgPath += (isXsTurn)?'ailose.gif':'aiwin.gif'
        resultImage.src= imgPath
        return true
    } else if (checkDraw()) {
        gameCount += 1
        gameCountLabel.innerHTML = `Game ${gameCount}-`+tellDifficulty()
        summaryResultText.innerHTML = `X= ${player1Score.innerHTML} , O=${player2Score.innerHTML} and Total-Game = ${gameCount-1}`
        resultMessageText.innerHTML = "Tie Game"+' <i class="fas fa-handshake"></i> '
        resultArea.classList.add('show')
        resultImage.src= './images/draw.gif'
        
        return true 
    } else {
        xTurn = !xTurn
        // Update board class Here //
        removeClassesFrom(board)
        addClassTo(board)
    }
    return false
}

function checkWin(currentMark) {
    return WINNING_COMBINATIONS.some(combs => {
        return [...combs].every(index => {
            return cells[index].classList.contains(currentMark)
        })
    })
}

function checkDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(X_MARK) || cell.classList.contains(O_MARK)
    })
}

// Main //

newGameBtn.addEventListener('click', startNewGame)
restartGameBtn.addEventListener('click', restart)
mode.addEventListener('click',toogleDifficulty)


export {WINNING_COMBINATIONS,X_MARK,O_MARK}

startNewGame()


/*
// # to check the algorithm with cases //
let temp = false
let clonedCells = [
    " "," "," ",
    " "," "," ",
    "x"," "," ",
]
console.log(clonedCells)
let solver = new Solver()
solver.minmax(clonedCells,true,temp,1,9)
console.log("Index answer : ",solver.finalResultIndex,"   cal :", solver.calculationCount)
*/