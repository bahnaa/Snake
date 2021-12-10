const game = document.querySelector(".game");
const snake = document.querySelector(".game__snake-head");
const snakeFirstBodyPart = document.getElementById("b1");

const FRUIT_BARS = 5; // sets the number of bars snake gets after eating a fruit
const MOVE_SPEED = 200; // sets the speed of the snake

// let DistanceX = 60; // for further upgrade
// let DistanceY = 540; // for further upgrade

let DistanceX = (Math.floor(Math.random() * (9 - 1)) + 1) * 60;
let DistanceY = (Math.floor(Math.random() * (9 - 1)) + 1) * 60;

const moveUnit = 60; // for further upgrade
let snakeLenght = 2; // for further upgrade

const idStorage = {
  intervalId: "",
  timeoutId: "",
};
const isRunning = {
  left: false,
  up: false,
  right: false,
  down: false,
};

function leftMove() {
  Object.keys(isRunning).forEach((run) => {
    isRunning[run] = false;
  });
  isRunning.left = true;
  connectMove();
  if (DistanceX === 0) {
    snake.style.left = "540px";
    DistanceX = 540;
  } else {
    DistanceX = DistanceX - moveUnit;
    snake.style.left = DistanceX + "px";
  }
  checkCoords();
  setTimeout(checkCrash, MOVE_SPEED / 10);
}

function rightMove() {
  Object.keys(isRunning).forEach((run) => {
    isRunning[run] = false;
  });
  isRunning.right = true;
  connectMove();
  if (DistanceX === 540) {
    snake.style.left = "0px";
    DistanceX = 0;
  } else {
    DistanceX = DistanceX + moveUnit;
    snake.style.left = DistanceX + "px";
  }
  if (snake.style.top === "") {
    snake.style.top = "540px";
  }
  checkCoords();
  setTimeout(checkCrash, MOVE_SPEED / 10);
}

function upMove() {
  Object.keys(isRunning).forEach((run) => {
    isRunning[run] = false;
  });
  isRunning.up = true;
  connectMove();
  if (DistanceY === 0) {
    snake.style.top = "540px";
    DistanceY = 540;
  } else {
    DistanceY = DistanceY - moveUnit;
    snake.style.top = DistanceY + "px";
  }
  if (snake.style.left === "") {
    snake.style.left = "60px";
  }
  checkCoords();
  setTimeout(checkCrash, MOVE_SPEED / 10);
}

function downMove() {
  Object.keys(isRunning).forEach((run) => {
    isRunning[run] = false;
  });
  isRunning.down = true;
  connectMove();
  if (DistanceY === 540) {
    snake.style.top = "0px";
    DistanceY = 0;
  } else {
    DistanceY = DistanceY + moveUnit;
    snake.style.top = DistanceY + "px";
  }
  if (snake.style.left === "") {
    snake.style.left = "60px";
  }
  checkCoords();
  setTimeout(checkCrash, MOVE_SPEED / 10);
}

function snakeMovement(e) {
  if (e.keyCode === 37) {
    if (isRunning.right) {
      return;
    }
    eyesDirectionChange("column");
    clearInterval(idStorage.intervalId);
    leftMove();
    let intervalId = setInterval(leftMove, MOVE_SPEED);
    idStorage.intervalId = intervalId;
  } else if (e.keyCode === 38) {
    if (isRunning.down) {
      return;
    }
    eyesDirectionChange("row");
    clearInterval(idStorage.intervalId);
    upMove();
    let intervalId = setInterval(upMove, MOVE_SPEED);
    idStorage.intervalId = intervalId;
  } else if (e.keyCode === 39) {
    if (isRunning.left) {
      return;
    }
    eyesDirectionChange("column");
    clearInterval(idStorage.intervalId);
    rightMove();
    let intervalId = setInterval(rightMove, MOVE_SPEED);
    idStorage.intervalId = intervalId;
  } else if (e.keyCode === 40) {
    if (isRunning.up) {
      return;
    }
    eyesDirectionChange("row");
    clearInterval(idStorage.intervalId);
    downMove();
    let intervalId = setInterval(downMove, MOVE_SPEED);
    idStorage.intervalId = intervalId;
  }
}

function eyesDirectionChange(direction) {
  snake.style.flexDirection = `${direction}`;
}

function connectMove() {
  const snakeFull = document.querySelectorAll(".body-part");
  for (let i = snakeFull.length - 1; i > 0; i--) {
    snakeFull[i].style.left = snakeFull[i - 1].offsetLeft + "px";
    snakeFull[i].style.top = snakeFull[i - 1].offsetTop + "px";
  }
}

function fruitSpawn() {
  const coordX = Math.floor(Math.random() * 10) * 60;
  const coordY = Math.floor(Math.random() * 10) * 60;
  const fruit = document.createElement("span");
  fruit.className = "game__fruit";
  fruit.style.left = coordX + "px";
  fruit.style.top = coordY + "px";
  game.appendChild(fruit);
}

function checkCoords() {
  const fruit = game.lastElementChild;
  if (
    fruit.className.includes("fruit") &&
    snake.style.left === fruit.style.left &&
    snake.style.top === fruit.style.top
  ) {
    fruit.remove();
    for (let i = 0; i < FRUIT_BARS; i++) {
      const snakeBodyPart = document.createElement("div");
      snakeBodyPart.classList.add("game__snake-body", "body-part");
      const horizontalTail = game.lastElementChild.offsetLeft;
      const verticalTail = game.lastElementChild.offsetTop;
      snakeBodyPart.style.left = horizontalTail + "px";
      snakeBodyPart.style.top = verticalTail + "px";
      game.appendChild(snakeBodyPart);
      snakeLenght++;
    }
    const timeoutId = setTimeout(fruitSpawn, 1000);
    idStorage.timeoutId = timeoutId;
  }
}

function checkCrash() {
  const snakeBody = document.querySelectorAll(".game__snake-body");
  const coordsComparision = [];
  coordsComparision.push({ left: snake.style.left, top: snake.style.top });
  const coords = [];
  snakeBody.forEach((part) => {
    coords.push({ left: part.style.left, top: part.style.top });
  });
  // const uniqueCoords = coords.reduce((arr, e) => {
  //   if (!arr.find((item) => item.left == e.left && item.top == e.top)) {
  //     arr.push(e);
  //   }
  //   return arr;
  // }, []);

  const filteredCoords = coords.reduce((p, c) => {
    if (p.length === 0) {
      p.push(c);
    } else if (p[p.length-1].left !== c.left || p[p.length-1].top !== c.top) {
      p.push(c);
    }
    return p;
  }, []);
  
console.log(coords);
console.log(filteredCoords);

  filteredCoords.forEach((coord) => {
    if (
      coord.left == coordsComparision[0].left &&
      coord.top == coordsComparision[0].top
    ) {
      alert(`You lose! Your final lenght was ${snakeLenght}`);
      clearInterval(idStorage.intervalId);
      clearTimeout(idStorage.timeoutId);
      window.removeEventListener("keydown", snakeMovement);
      createRestartButton();
    }
  });
}

function createRestartButton() {
  const restartButton = document.createElement("button");
  restartButton.innerText = "Play again";
  restartButton.classList.add("restart-button");
  restartButton.addEventListener("click", () => {
    location.reload();
  });
  document.body.insertBefore(restartButton, game);
}

function gameStart() {
  setStartCoords();
  setTimeout(fruitSpawn, 2000);
}

function setStartCoords() {
  snake.style.left = DistanceX + "px";
  snake.style.top = DistanceY + "px";
  const location = ["X", "Y"];
  const side = [-60, 60];
  const locationRandom = location[Math.round(Math.random())];
  const sideRandom = side[Math.round(Math.random())];
  if (locationRandom === "Y") {
    eyesDirectionChange('row');
    snakeFirstBodyPart.style.left = DistanceX + "px";
    if (side === -60) {
      snakeFirstBodyPart.style.top = DistanceY - 60 + "px";
    } else {
      snakeFirstBodyPart.style.top = DistanceY + 60 + "px";
    }
  } else {
    snakeFirstBodyPart.style.top = DistanceY + "px";
    if (sideRandom === -60) {
      snakeFirstBodyPart.style.left = DistanceX - 60 + "px";
    } else {
      snakeFirstBodyPart.style.left = DistanceX + 60 + "px";
    }
  }
  console.log(locationRandom);
}

window.addEventListener("keydown", snakeMovement);

// 37 left
// 38 up
// 39 right
// 40 down

gameStart();
