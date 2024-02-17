let inputBuffer = {};
let mazeSize = 5; //in the demo, the maze is 5x5 until changed.

let gameScore = 0;
let gameTimer = 0;
let canvas = null;
let context = null;
let COORD_SIZE = 0;
let CELL_SIZE = 0;

let toRenderHint = false;
let toRenderSolution = false;
let toRenderBreadcrumb = false;

let gameOver = false;

let visitedCells = [];

let imgFloor = new Image();
imgFloor.isReady = false;
imgFloor.onload = function () {
  this.isReady = true;
};
imgFloor.src = "floor.png";

let maze = [];
let myCharacter = null;
let end = null;

let visited = [];
let solution = [];

let leaderBoard = [
  [0, 5],
  [0, 5],
  [0, 5],
  [0, 5],
  [0, 5],
];

function resetSolution() {
  solution = [];
  visited = [];

  for (let row = 0; row < mazeSize; row++) {
    solution.push([]);
    visited.push([]);
    for (let col = 0; col < mazeSize; col++) {
      visited[row][col] = false;
      solution[row][col] = false;
    }
  }
}

function solveMaze(currentSolveCell, maze, visited, solution) {
  if (visited[currentSolveCell.y][currentSolveCell.x] === true) {
    return false;
  }
  visited[currentSolveCell.y][currentSolveCell.x] = true;
  if (
    currentSolveCell.x === mazeSize - 1 &&
    currentSolveCell.y === mazeSize - 1
  ) {
    return true;
  }
  let north = false;
  let east = false;
  let south = false;
  let west = false;
  if (currentSolveCell.edges.n) {
    //We need to try both
    north = solveMaze(currentSolveCell.edges.n, maze, visited, solution);
  }
  if (currentSolveCell.edges.e) {
    east = solveMaze(currentSolveCell.edges.e, maze, visited, solution);
  }
  if (currentSolveCell.edges.s) {
    south = solveMaze(currentSolveCell.edges.s, maze, visited, solution);
  }
  if (currentSolveCell.edges.w) {
    west = solveMaze(currentSolveCell.edges.w, maze, visited, solution);
  }
  if (north || east || south || west) {
    solution[currentSolveCell.y][currentSolveCell.x] = true;
    return true;
  }
}

function initSolution() {
  solution = [];
  for (let row = 0; row < mazeSize; row++) {
    solution.push([]);
    for (let col = 0; col < mazeSize; col++) {
      solution[row].push(false);
    }
  }
}

function initVisitedCells() {
  visitedCells = [];
  for (let row = 0; row < mazeSize; row++) {
    visitedCells.push([]);
    for (let col = 0; col < mazeSize; col++) {
      visitedCells[row][col] = false;
    }
  }
}

function initializeMaze(n) {
  maze = [];
  for (let row = 0; row < n; row++) {
    maze.push([]);
    for (let col = 0; col < n; col++) {
      maze[row].push({
        x: col,
        y: row,
        edges: {
          n: null,
          s: null,
          w: null,
          e: null,
        },
      });
    }
  }
  generateMaze();
}

function generateMaze() {
  const visited = new Set();
  const walls = [];

  const startRow = Math.floor(Math.random() * maze.length);
  const startCol = Math.floor(Math.random() * maze[0].length);
  let currentCell = maze[startRow][startCol];
  visited.add(currentCell);
  addWalls(currentCell, walls);

  while (walls.length > 0) {
    const randomIndex = Math.floor(Math.random() * walls.length);
    const randomWall = walls[randomIndex];

    walls.splice(randomIndex, 1);

    const { cell1, cell2 } = randomWall;

    if (visited.has(cell1) && !visited.has(cell2)) {
      connectCells(cell1, cell2);
      visited.add(cell2);
      addWalls(cell2, walls);
    } else if (visited.has(cell2) && !visited.has(cell1)) {
      connectCells(cell1, cell2);
      visited.add(cell1);
      addWalls(cell1, walls);
    }
  }
}

function addWalls(cell, walls) {
  const { x, y } = cell;

  if (y > 0 && cell.edges.n === null) {
    walls.push({ cell1: cell, cell2: maze[y - 1][x] });
  }

  if (y < maze.length - 1 && cell.edges.s === null) {
    walls.push({ cell1: cell, cell2: maze[y + 1][x] });
  }

  if (x > 0 && cell.edges.w === null) {
    walls.push({ cell1: cell, cell2: maze[y][x - 1] });
  }

  if (x < maze[0].length - 1 && cell.edges.e === null) {
    walls.push({ cell1: cell, cell2: maze[y][x + 1] });
  }
}

function connectCells(cell1, cell2) {
  const { x: x1, y: y1 } = cell1;
  const { x: x2, y: y2 } = cell2;

  if (y1 < y2) {
    cell1.edges.s = cell2;
    cell2.edges.n = cell1;
  } else if (y1 > y2) {
    cell1.edges.n = cell2;
    cell2.edges.s = cell1;
  } else if (x1 < x2) {
    cell1.edges.e = cell2;
    cell2.edges.w = cell1;
  } else if (x1 > x2) {
    cell1.edges.w = cell2;
    cell2.edges.e = cell1;
  }
}

function drawCell(cell) {
  if (imgFloor.isReady) {
    context.drawImage(
      imgFloor,
      cell.x * CELL_SIZE,
      cell.y * CELL_SIZE,
      COORD_SIZE / 3 + 0.5,
      COORD_SIZE / 3 + 0.5
    );
  }

  if (cell.edges.n === null) {
    context.moveTo(cell.x * CELL_SIZE, cell.y * CELL_SIZE);
    context.lineTo((cell.x + 1) * CELL_SIZE, cell.y * CELL_SIZE);
  }

  if (cell.edges.s === null) {
    context.moveTo(cell.x * CELL_SIZE, (cell.y + 1) * CELL_SIZE);
    context.lineTo((cell.x + 1) * CELL_SIZE, (cell.y + 1) * CELL_SIZE);
  }

  if (cell.edges.e === null) {
    context.moveTo((cell.x + 1) * CELL_SIZE, cell.y * CELL_SIZE);
    context.lineTo((cell.x + 1) * CELL_SIZE, (cell.y + 1) * CELL_SIZE);
  }

  if (cell.edges.w === null) {
    context.moveTo(cell.x * CELL_SIZE, cell.y * CELL_SIZE);
    context.lineTo(cell.x * CELL_SIZE, (cell.y + 1) * CELL_SIZE);
  }
}

function leaderBoardCheck() {
  for (let i = 0; i <= 4; i++) {
    if (gameScore > leaderBoard[i][0]) {
      for (let j = 4; j > i; j--) {
        leaderBoard[j][0] = leaderBoard[j - 1][0];
        leaderBoard[j][1] = leaderBoard[j - 1][1];
      }
      leaderBoard[i][0] = gameScore;
      leaderBoard[i][1] = mazeSize;
      break;
    }
  }
}

function renderEnd(end) {
  if (end.image.isReady) {
    const referenceSize = 0.3;
    const scaleFactor = mazeSize / referenceSize;
    const scaledWidth = end.image.width / scaleFactor;
    const scaledHeight = end.image.height / scaleFactor;
    centerX = end.location.x * CELL_SIZE + CELL_SIZE / 2;
    centerY = end.location.y * CELL_SIZE + CELL_SIZE / 2;

    context.drawImage(
      end.image,
      centerX - scaledWidth / 2,
      centerY - scaledHeight / 2,
      scaledWidth,
      scaledHeight
    );
  }
}
function renderCharacter(character) {
  if (character.image.isReady) {
    const referenceSize = 2;
    const scaleFactor = mazeSize / referenceSize;
    const scaledWidth = character.image.width / scaleFactor;
    const scaledHeight = character.image.height / scaleFactor;
    centerX = character.location.x * CELL_SIZE + CELL_SIZE / 2;
    centerY = character.location.y * CELL_SIZE + CELL_SIZE / 2;

    context.drawImage(
      character.image,
      centerX - scaledWidth / 2,
      centerY - scaledHeight / 2,
      scaledWidth,
      scaledHeight
    );
  }
}
function startNewGame(mazeSize) {
  maze = [];
  resetSolution();
  gameTimer = 0;
  gameScore = 0;
  toRenderBreadcrumb = false;
  toRenderHint = false;
  toRenderSolution = false;

  CELL_SIZE = COORD_SIZE / mazeSize;
  initializeMaze(mazeSize);
  solveMaze(maze[0][0], maze, visited, solution);
  initVisitedCells();
  myCharacter = initializeCharacter("character.png", maze[0][0]);

  end = initializeEnd();

  //For some reason, sometimes the solution bath turns into the breadcrumbs

  gameOver = false;
}
let keyPressed = {};

function buttonDown(key, character) {
  if (keyPressed[key]) return;

  keyPressed[key] = true;
  window.addEventListener("keyup", function (event) {
    keyPressed[event.key] = false;
  });
  if (key === "ArrowDown" || key === "s" || key === "k") {
    if (character.location.edges.s && gameOver === false) {
      if (
        solution[character.location.y + 1][character.location.x] == true &&
        visitedCells[character.location.y + 1][character.location.x] == false
      ) {
        gameScore += 5;
      }

      if (solution[character.location.y][character.location.x] == true) {
        solution[character.location.y][character.location.x] = false;
      }
      if (solution[character.location.y + 1][character.location.x] == false) {
        solution[character.location.y][character.location.x] = true;
        gameScore -= 1;
      }

      visitedCells[character.location.y][character.location.x] = true;

      character.location = character.location.edges.s;
    }
  }
  if (key == "ArrowUp" || key == "w" || key === "i") {
    if (character.location.edges.n && gameOver === false) {
      if (
        solution[character.location.y - 1][character.location.x] == true &&
        visitedCells[character.location.y - 1][character.location.x] == false
      ) {
        gameScore += 5;
      }
      if (solution[character.location.y][character.location.x] == true) {
        solution[character.location.y][character.location.x] = false;
      }
      if (solution[character.location.y - 1][character.location.x] == false) {
        solution[character.location.y][character.location.x] = true;
        gameScore -= 1;
      }
      visitedCells[character.location.y][character.location.x] = true;

      character.location = character.location.edges.n;
    }
  }
  if (key == "ArrowRight" || key == "d" || key === "l") {
    if (character.location.edges.e && gameOver === false) {
      if (
        solution[character.location.y][character.location.x] == true &&
        visitedCells[character.location.y][character.location.x + 1] == false
      ) {
        gameScore += 5;
      }
      if (solution[character.location.y][character.location.x] == true) {
        solution[character.location.y][character.location.x] = false;
      }
      if (solution[character.location.y][character.location.x + 1] == false) {
        solution[character.location.y][character.location.x] = true;
        gameScore -= 1;
      }
      visitedCells[character.location.y][character.location.x] = true;

      character.location = character.location.edges.e;
    }
  }
  if (key == "ArrowLeft" || key == "a" || key === "j") {
    if (character.location.edges.w && gameOver === false) {
      if (
        solution[character.location.y][character.location.x] == true &&
        visitedCells[character.location.y][character.location.x - 1] == false
      ) {
        gameScore += 5;
      }
      if (solution[character.location.y][character.location.x] == true) {
        solution[character.location.y][character.location.x] = false;
      }
      if (solution[character.location.y][character.location.x - 1] == false) {
        solution[character.location.y][character.location.x] = true;
        gameScore -= 1;
      }
      visitedCells[character.location.y][character.location.x] = true;

      character.location = character.location.edges.w;
    }
  }
  if (key == "1") {
    mazeSize = 5;
    startNewGame(mazeSize);
  }
  if (key == "2") {
    mazeSize = 10;
    startNewGame(mazeSize);
  }
  if (key == "3") {
    mazeSize = 15;
    startNewGame(mazeSize);
  }
  if (key == "4") {
    mazeSize = 20;
    startNewGame(mazeSize);
  }
  if (key == "h") {
    if (!gameOver) {
      toRenderHint = !toRenderHint;
      if (toRenderSolution) {
        toRenderSolution = false;
      }
    }
  }
  if (key == "b") {
    toRenderBreadcrumb = !toRenderBreadcrumb;
  }
  if (key == "p") {
    if (!gameOver) {
      toRenderSolution = !toRenderSolution;
      if (toRenderHint) {
        toRenderHint = false;
      }
    }
  }
  if (
    character.location.x === mazeSize - 1 &&
    character.location.y === mazeSize - 1
  ) {
    if (gameOver == false) {
      gameOver = true;
      toRenderHint = false;
      toRenderSolution = false;
      //Its fun to see the breadcrumbs afterwards
      leaderBoardCheck();
    }
  }
}

function renderMaze() {
  // Render the cells first
  context.beginPath();
  for (let row = 0; row < mazeSize; row++) {
    for (let col = 0; col < mazeSize; col++) {
      drawCell(maze[row][col]);
    }
  }
  context.strokeStyle = "rgb(128, 0, 0)";
  context.lineWidth = 3;
  context.stroke();
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(COORD_SIZE - 1, 0);
  context.lineTo(COORD_SIZE - 1, COORD_SIZE - 1);
  context.lineTo(0, COORD_SIZE - 1);
  context.closePath();
  context.strokeStyle = "rgb(0, 0, 0)";
  context.stroke();
}

//
// Immediately invoked anonymous function
//
function initializeEnd() {
  let image = new Image();
  image.isReady = false;
  image.onload = function () {
    this.isReady = true;
  };
  image.src = "end.png";
  return {
    location: maze[mazeSize - 1][mazeSize - 1],
    image: image,
  };
}

function initializeCharacter(imageSource, location) {
  let image = new Image();
  image.isReady = false;
  image.onload = function () {
    this.isReady = true;
  };

  image.src = imageSource;
  return {
    location: location,
    image: image,
  };
}

function renderEndScreen() {
  if (!gameOver) return;
  context.fillStyle = "rgba(0, 0, 0, 0.5)";
  context.fillRect(0, 0, COORD_SIZE, COORD_SIZE);
  context.fillStyle = "white";
  context.font = "50px Arial";
  const text = "You Win!!!!!!!!!!";
  const textWidth = context.measureText(text).width;
  context.fillText(text, (COORD_SIZE - textWidth) / 2, COORD_SIZE / 2);
  context.font = "40px Arial";
  const newText = "Press 1, 2, 3, or 4 to start a new maze.";
  const newTextWidth = context.measureText(newText).width;
  context.fillText(
    newText,
    (COORD_SIZE - newTextWidth) / 2,
    COORD_SIZE / 2 + 50
  );
}
function renderTime() {
  if (!gameOver) {
    let timeInSeconds = Math.floor(gameTimer / 1000);
    let timerElement = document.getElementById("timer");
    timerElement.innerHTML = "Time: " + timeInSeconds;
  }
}
function renderScore() {
  let scoreElement = document.getElementById("score");
  scoreElement.innerHTML = "Score: " + gameScore;
}
function renderBreadcrumbs() {
  if (!toRenderBreadcrumb) return;
  for (let row = 0; row < mazeSize; row++) {
    for (let col = 0; col < mazeSize; col++) {
      if (visitedCells[row][col] === true) {
        context.beginPath();
        context.arc(
          col * CELL_SIZE + CELL_SIZE / 2,
          row * CELL_SIZE + CELL_SIZE / 2,
          15,
          0,
          2 * Math.PI
        );
        context.fillStyle = "black";
        context.fill();
      }
    }
  }
}
function renderPath() {
  if (!toRenderSolution) return;

  for (let row = 0; row < mazeSize; row++) {
    for (let col = 0; col < mazeSize; col++) {
      if (solution[row][col] === true) {
        context.beginPath();
        context.arc(
          col * CELL_SIZE + CELL_SIZE / 2,
          row * CELL_SIZE + CELL_SIZE / 2,
          10,
          0,
          2 * Math.PI
        );
        context.fillStyle = "white";
        context.fill();
      }
    }
  }
}
function renderHint() {
  if (!toRenderHint) return;
  if (
    myCharacter.location.edges.n &&
    solution[myCharacter.location.y - 1][myCharacter.location.x] == true
  ) {
    context.beginPath();
    context.arc(
      myCharacter.location.x * CELL_SIZE + CELL_SIZE / 2,
      myCharacter.location.y * CELL_SIZE + CELL_SIZE / 2 - CELL_SIZE,
      10,
      0,
      2 * Math.PI
    );
    context.fillStyle = "blue";
    context.fill();
  } else if (
    myCharacter.location.edges.e &&
    solution[myCharacter.location.y][myCharacter.location.x + 1] == true
  ) {
    context.beginPath();
    context.arc(
      myCharacter.location.x * CELL_SIZE + CELL_SIZE / 2 + CELL_SIZE,
      myCharacter.location.y * CELL_SIZE + CELL_SIZE / 2,
      10,
      0,
      2 * Math.PI
    );
    context.fillStyle = "blue";
    context.fill();
  } else if (
    myCharacter.location.edges.s &&
    solution[myCharacter.location.y + 1][myCharacter.location.x] == true
  ) {
    context.beginPath();
    context.arc(
      myCharacter.location.x * CELL_SIZE + CELL_SIZE / 2,
      myCharacter.location.y * CELL_SIZE + CELL_SIZE / 2 + CELL_SIZE,
      10,
      0,
      2 * Math.PI
    );
    context.fillStyle = "blue";
    context.fill();
  } else if (
    myCharacter.location.edges.w &&
    solution[myCharacter.location.y][myCharacter.location.x - 1] == true
  ) {
    context.beginPath();
    context.arc(
      myCharacter.location.x * CELL_SIZE + CELL_SIZE / 2 - CELL_SIZE,
      myCharacter.location.y * CELL_SIZE + CELL_SIZE / 2,
      10,
      0,
      2 * Math.PI
    );
    context.fillStyle = "blue";
    context.fill();
  }
}
function renderLeaderBoard() {
  let leaderBoardElement = document.getElementById("leaderboard");
  leaderBoardElement.innerHTML = "";
  leaderBoardElement.innerHTML += "Leaderboard: (Score, Maze Size)<br/>";
  for (let i = 0; i <= 4; i++) {
    leaderBoardElement.innerHTML +=
      i +
      1 +
      ") | " +
      leaderBoard[i][0] +
      " " +
      leaderBoard[i][1] +
      " | " +
      "<br/>";
  }
}

function render(elapsedTime) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  renderMaze();
  renderBreadcrumbs();
  renderPath();
  renderHint();
  renderCharacter(myCharacter);
  renderEnd(end);
  renderTime();
  renderScore();
  renderLeaderBoard();
  renderEndScreen();
}

function processInput() {
  for (let input in inputBuffer) {
    if (inputBuffer.hasOwnProperty(input)) {
      buttonDown(inputBuffer[input], myCharacter);
    }
  }
  inputBuffer = {}; // Clear the input buffer after processing
}
let lastTimestamp = 0;

function update(elapsedTime) {
  if (gameOver) {
    if (myCharacter.location.x == 0) {
      gameOver = false;
    }
  }
  gameTimer += elapsedTime;
}

function gameLoop(timestamp) {
  const elapsedTime = timestamp - lastTimestamp;
  processInput();
  update(elapsedTime);
  render(elapsedTime);

  lastTimestamp = timestamp;

  requestAnimationFrame(gameLoop);
}

function initialize() {
  canvas = document.getElementById("canvas-main");
  context = canvas.getContext("2d");

  COORD_SIZE = canvas.width;

  mazeSize = 5;
  startNewGame(mazeSize);

  window.addEventListener("keydown", function (event) {
    inputBuffer[event.key] = event.key;
  });

  requestAnimationFrame(gameLoop);
}
