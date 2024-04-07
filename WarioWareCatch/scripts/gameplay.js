MyGame.screens["game-play"] = (function (
  game,
  objects,
  renderer,
  graphics,
  input
) {
  "use strict";
  let updatedLeaderBoard = false;
  let toRenderGameover = false;
  let lastTimeStamp = performance.now();
  let cancelNextRequest = true;
  let polesCaught = 0;
  let score = 0;
  let poleReseting = false;
  let pressedSpace = false;
  let myStorage = objects.Storage();
  let timer = 1000;
  let myKeyboard = input.Keyboard();
  let myPanel = objects.Logo({
    imageSrc: "assets/panel.png",
    center: { x: 150, y: graphics.canvas.height - 65 },
    size: { width: 300, height: 125 },
  });
  let myGameOverScreen = objects.Text({
    text: "Game Over",
    font: "48pt Arial",
    fillStyle: "rgba(255, 0, 0, 1)",
    strokeStyle: "rgba(0, 0, 0, 1)",
    position: {
      x: graphics.canvas.width / 2 - 150,
      y: graphics.canvas.height / 2 - 55,
    },
  });
  let myGameOverScore = objects.Text({
    text: "Score: ",
    font: "48pt Arial",
    fillStyle: "rgba(255, 255, 0, 1)",
    strokeStyle: "rgba(0, 0, 0, 2)",
    position: {
      x: graphics.canvas.width / 2 - 150,
      y: graphics.canvas.height / 2,
    },
  });
  let myBackground = objects.Logo({
    imageSrc: "assets/background.png",
    center: { x: graphics.canvas.width / 2, y: graphics.canvas.height / 2 },
    size: { width: 800, height: 800 },
    moveRate: 500 / 1000,
  });
  let myText = objects.Text({
    text: "This is a test",
    font: "28pt Arial",
    fillStyle: "rgba(255, 255, 0, 1)",
    strokeStyle: "rgba(0, 0, 0, 1)",
    position: { x: 25, y: graphics.canvas.height - 100 },
  });
  let myScore = objects.Text({
    text: "Score: 0",
    font: "28pt Arial",
    fillStyle: "rgba(255, 255, 0, 1)",
    strokeStyle: "rgba(0, 0, 0, 1)",
    position: { x: 25, y: graphics.canvas.height - 50 },
  });
  let myTopHand = objects.TopHand({
    imageSrc: "assets/top_hand_closed.png",
    secondImageSrc: "assets/top_hand_open.png",
    center: { x: graphics.canvas.width / 2, y: 100 },
    size: { width: 75, height: 75 },
    moveRate: 500 / 1000,
  });
  let myBottomHand = objects.Logo({
    imageSrc: "assets/hand_open.png",
    secondImageSrc: "assets/hand_closed.png",
    center: { x: graphics.canvas.width / 2, y: 700 },
    size: { width: 75, height: 75 },
    moveRate: 500 / 1000,
  });
  let myPole = objects.Pole({
    imageSrc: "assets/pole.png",
    center: { x: graphics.canvas.width / 2, y: 100 },
    size: { width: 15, height: 200 },
  });

  let objParticle = objects.ParticleSystem({
    center: { x: 1000, y: 1000 },
    size: { mean: 10, stdev: 4 },
    speed: { mean: 50, stdev: 25 },
    lifetime: { mean: 0.5, stdev: 0.25 },
  });
  let particleRender = renderer.ParticleSystem(
    objParticle,
    graphics,
    "assets/particle.png"
  );

  let catchSound = new Audio();
  catchSound.src = "assets/catch.wav";
  let failSound = new Audio();
  failSound.src = "assets/miss.wav";

  function processInput(elapsedTime) {
    myKeyboard.update(elapsedTime);
  }
  function calcScore(thingsCaught) {
    let score = 0;
    let value = 100;

    for (let i = 0; i < thingsCaught; i++) {
      score += value;
      value *= 2;
    }
    return score;
  }

  function update(elapsedTime) {
    myScore.setTextString("Score: " + calcScore(polesCaught));
    score = calcScore(polesCaught);
    myText.setTextString("Poles Caught: " + polesCaught);
    objParticle.update(elapsedTime);
    if (!toRenderGameover) {
      myPole.update(elapsedTime);
    }

    if (myPole.goingDown) {
      myTopHand.letGO();
      // myBottomHand.reset();
    }
    if (myPole.isOffScreen()) {
      toRenderGameover = true;
      onGameOver();
    }
    if (poleReseting) {
      timer -= elapsedTime;
      if (timer <= 0) {
        myPole.reset(polesCaught);
        myBottomHand.reset();
        myTopHand.reset();
        objParticle.updatePoleHeight(myPole.size.height);
        objParticle.setCenter(1000, 1000);
        pressedSpace = false;
        poleReseting = false;
        timer = 1000;
      }
    }
  }

  function render() {
    graphics.clear();
    renderer.Logo.render(myBackground);
    renderer.Logo.render(myPanel);

    renderer.Text.render(myText);
    renderer.Text.render(myScore);
    renderer.Pole.render(myPole);
    renderer.TopHand.render(myTopHand);
    renderer.Logo.render(myBottomHand);
    if (toRenderGameover) {
      renderer.Text.render(myGameOverScore);
      renderer.Text.render(myGameOverScreen);
    }
    if (poleReseting) {
      particleRender.render();
    }
  }

  function gameLoop(time) {
    let elapsedTime = time - lastTimeStamp;
    lastTimeStamp = time;

    processInput(elapsedTime);
    update(elapsedTime);
    render();

    if (!cancelNextRequest) {
      requestAnimationFrame(gameLoop);
    }
  }
  function onSpace() {
    if (pressedSpace) return;
    pressedSpace = true;
    myBottomHand.catchPole();
    if (myPole.checkIfCaught()) {
      objParticle.setCenter(myPole.center.x, myPole.center.y);
      polesCaught++;
      poleReseting = true;
      catchSound.play();
      // myPole.reset(polesCaught);
    } else {
      if (myPole.isOffScreen()) {
        toRenderGameover = true;
        onGameOver();
      } else {
        toRenderGameover = true;
        onGameOver();
      }
    }
  }

  function onGameOver() {
    myGameOverScore.setTextString("Score: " + score);
    myKeyboard.removeAll();
    myKeyboard.register("Escape", function () {
      cancelNextRequest = true;
      game.showScreen("main-menu");
    });
    //Next do leaderboard stuff.
    if (!updatedLeaderBoard) {
      myStorage.updateLeaderBoard(score);
      myStorage.updateHTML();
      updatedLeaderBoard = true;
      failSound.play();
    }
  }

  function initialize() {
    myKeyboard.register(" ", onSpace); //CATCH.

    myKeyboard.register("Escape", function () {
      cancelNextRequest = true;
      game.showScreen("main-menu");
    });

    let canvas = document.getElementById("id-canvas");
  }

  function run() {
    myKeyboard.register(" ", onSpace);
    myKeyboard.register("Escape", function () {
      cancelNextRequest = true;
      game.showScreen("main-menu");
    });
    polesCaught = 0;
    score = 0;
    lastTimeStamp = performance.now();
    pressedSpace = false;
    cancelNextRequest = false;
    toRenderGameover = false;
    updatedLeaderBoard = false;
    myPole.updateTimer();
    myPole.reset();
    myTopHand.reset();
    myBottomHand.reset();
    requestAnimationFrame(gameLoop);
  }

  return {
    initialize: initialize,
    run: run,
  };
})(MyGame.game, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input);
