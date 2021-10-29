// P5 drawing

let canvasWidth = 280
let canvasHeight = 280
let pixelWidth = 10
let grid = []

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    generateGrid()
    console.log(grid);
  }

function draw() {
    if (mouseIsPressed && checkInCanvas(mouseX, mouseY)){
        let [xIdx, yIdx] = findGridIndicies(mouseX, mouseY)
        let [xDraw, yDraw] = findDrawLocation(mouseX, mouseY)
        let pixelIntensity = grid[yIdx][xIdx]
        let newPixelIntensity
        if (pixelIntensity == 0){
            newPixelIntensity = 100
        } else {
            newPixelIntensity = pixelIntensity + 5
        }
        grid[yIdx][xIdx] = newPixelIntensity
        fill(newPixelIntensity)
        square(xDraw, yDraw, pixelWidth);
    } else {
        fill(255)
    }
}

function generateGrid(){
    grid = []
    for (let i=0; i<canvasHeight/pixelWidth; i++){
        // add a row
        grid.push([])

        // add the columns to that row
        for (let j=0; j<canvasWidth/pixelWidth; j++){
            grid[i].push(0)
        }
    }
}

function findDrawLocation(x,y){
    let xDraw = Math.round(x / 10) * 10
    let yDraw = Math.round(y / 10) * 10
    return [xDraw, yDraw]
}

function findGridIndicies(x,y){
    let xIdx = Math.round(x / 10)
    let yIdx = Math.round(y / 10)
    return [xIdx, yIdx]
}

function checkInCanvas(x,y){
    if (x<canvasWidth && x>0 && y<canvasHeight-5 && y>0){
        return true
    }
    return false
}

function resetAll(){
    clear()
    generateGrid()
}

async function requestPrediction(grid){
    let url = 'http://127.0.0.1:8000/api/prediction'

    let info = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(grid)
    }

    let response = await fetch(url, info)
    let content = await response.json()
    console.log(content);
    console.log(content.Prediction);

    const predictionText = document.getElementById('prediction')
    predictionText.textContent = content.Prediction
}

// General

const clearBtn = document.getElementById('clear-button')
clearBtn.addEventListener('click', () => resetAll())

const showGridBtn = document.getElementById('show-grid')
showGridBtn.addEventListener('click', () => console.log(grid))

const predictBtn = document.getElementById('get-prediction')
predictBtn.addEventListener('click', () => requestPrediction(grid))
