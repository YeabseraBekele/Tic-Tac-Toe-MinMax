
// the AI logic will be implemeted here //
import {WINNING_COMBINATIONS,X_MARK,O_MARK} from './script.js'

const BOARD_SIZE = 9;

class Solver{
    finalResultIndex = -1;
    calculationCount = 0;

    checkWin(cellsCloned,currentMark) {
        return WINNING_COMBINATIONS.some(combs => {
            return [...combs].every(index => {
                return cellsCloned[index]==currentMark
            })
        })
    }
    checkDraw(cellsCloned) {
        return [...cellsCloned].every(cell => {
            return cell==X_MARK || cell==O_MARK
        })
    }
    
    minmax(cellsClone,firstTime,turnX,depthCount,difficultyLevel){
        this.calculationCount += 1;

        if(depthCount==difficultyLevel){
            if(this.checkWin(cellsClone,X_MARK))return 10+depthCount;
            if(this.checkWin(cellsClone,O_MARK))return depthCount-10;
            return 0;
        }

        if(this.checkWin(cellsClone,X_MARK))return 10+depthCount;
        if(this.checkWin(cellsClone,O_MARK))return depthCount-10;
        if(this.checkDraw(cellsClone))return 0 
        
        let equalAnswersCombo = []
        if(turnX){
            let maxValue = -100000;
            let resultIndex = -1;
            let returnedResult;  
            /*
            # This code is for theoretical answer 
            for(let i=0;i<BOARD_SIZE;i++){
                if(cellsClone[i]!=" ") continue;
                cellsClone[i] = X_MARK;
                if(firstTime){ 
                    //console.log("Here 1",i,cellsClone)
                    if(this.checkWin(cellsClone,X_MARK)){
                        this.finalResultIndex = i;
                        console.log("Here P")
                        return maxValue
                    }
                }
                cellsClone[i] = " ";
            } */ 
            for(let i=0;i<BOARD_SIZE;i++){
                if(cellsClone[i]!=" ") continue;
                cellsClone[i] = X_MARK;
                returnedResult = this.minmax(cellsClone,false,!turnX,depthCount+1,difficultyLevel);
                
                /*
                // This code is for theoretical answer // 
                if(firstTime){ 
                   
                    cellsClone[i] = O_MARK
                    console.log("Here 1",i,cellsClone)
                    if(this.checkWin(cellsClone,O_MARK)){
                        this.finalResultIndex = i;
                        console.log("Here 2")
                        return maxValue
                    }
                    cellsClone[i] = X_MARK
                }*/
                
                if(returnedResult==maxValue && firstTime){
                    equalAnswersCombo.push(i) 
                }else if(returnedResult>maxValue){
                    maxValue = returnedResult 
                    resultIndex = i 
                    equalAnswersCombo = []
                    equalAnswersCombo.push(i) 
                }
                cellsClone[i] = " "
            }
            if(firstTime){
                let randomComboIndex = Math.floor(Math.random()*equalAnswersCombo.length)
                this.finalResultIndex = equalAnswersCombo[randomComboIndex] 
            }
            return maxValue;

        }else{  
            let minValue = 100000;
            let resultIndex = -1;
            let returnedResult;

            /*
            # This code is for theoretical answer // 
            for(let i=0;i<BOARD_SIZE;i++){
                if(cellsClone[i]!=" ") continue;
                cellsClone[i] = O_MARK;
                if(firstTime){ 
                    //console.log("Here 1",i,cellsClone)
                    if(this.checkWin(cellsClone,O_MARK)){
                        this.finalResultIndex = i;
                        console.log("Here Q")
                        return minValue
                    }
                }
                cellsClone[i] = " ";
            }*/

            for(let i=0;i<BOARD_SIZE;i++){
                if(cellsClone[i]!=" ") continue;
                cellsClone[i]= O_MARK;
                returnedResult = this.minmax(cellsClone,false,!turnX,depthCount+1,difficultyLevel);
                /*
                # This code is for theoretical answer // 
                if(firstTime){ 
                    cellsClone[i] = X_MARK
                    console.log("Here 1",i,cellsClone)
                    if(this.checkWin(cellsClone,X_MARK)){
                        this.finalResultIndex = i;
                        console.log("Here 2")
                        return minValue
                    }
                    cellsClone[i] = O_MARK
                }*/
                
                if(returnedResult==minValue && firstTime){
                    equalAnswersCombo.push(i) 
                }else if(returnedResult<minValue){
                    minValue = returnedResult;
                    resultIndex = i;
                    equalAnswersCombo = []
                    equalAnswersCombo.push(i) 
                }

                cellsClone[i]=" "
            }
            
            if(firstTime){
                let randomComboIndex = Math.floor(Math.random()*equalAnswersCombo.length)
                this.finalResultIndex = equalAnswersCombo[randomComboIndex]    
            }
            return minValue;
        }

    }
   
    translateCells(cells){
        let arrayCell = [];
        cells.forEach(cell=>{
            if(cell.classList.contains(X_MARK))
                arrayCell.push(X_MARK)
            else if(cell.classList.contains(O_MARK))
                arrayCell.push(O_MARK)
            else{
                arrayCell.push(" ");
            }
        })
        return arrayCell;
    }
    
}  

export {Solver}