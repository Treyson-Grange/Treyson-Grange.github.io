MyGame.screens["game-play"] = (function (
  game,
  objects,
  renderer,
  graphics,
  input,
  lander
) {
  "use strict";
  let terrainData = [];
  let difficulty = 1;
  let renderGameOver = false;
  let renderWin = false;
  let renderScore = false;
  let renderTimer = false;
  let renderCrash = false;
  let playedCrash = false;
  let toRenderThrust = false;
  let zone1Left = 100000;
  let zone1Right = 100000;
  let zone2Left = 100000;
  let zone2Right = 100000;
  let timeOut = 3000;
  let landed = false;
  let score = 0;
  let canvas = document.getElementById("id-canvas");

  function recurseBuildTerrain(startPoint, endPoint) {
    if (endPoint.hori - startPoint.hori <= 5) {
      return [startPoint, endPoint];
    }
    let uRandom, vRandom;
    do {
      uRandom = Math.random();
    } while (uRandom === 0);
    do {
      vRandom = Math.random();
    } while (vRandom === 0);
    const ruggedness = 0.8;
    const standardNormal1 =
      Math.sqrt(-2.0 * Math.log(uRandom)) * Math.cos(2.0 * Math.PI * vRandom);
    const displacement =
      ruggedness * standardNormal1 * Math.abs(endPoint.hori - startPoint.hori);

    let midpointVert = 0.5 * (startPoint.vert + endPoint.vert) + displacement;

    midpointVert = Math.max(300, midpointVert);
    midpointVert = Math.min(750, midpointVert);

    const midPoint = {
      vert: midpointVert,
      hori: Math.round(startPoint.hori + (endPoint.hori - startPoint.hori) / 2),
    };
    return [
      ...recurseBuildTerrain(startPoint, midPoint),
      ...recurseBuildTerrain(midPoint, endPoint),
    ];
  }

  function generateTerrain() {
    let width = canvas.width;
    let height = canvas.height;
    let midHeight = Math.floor(height / 2);
    let leftPoint = {
      vert: Math.round(Math.random() * midHeight + midHeight),
      hori: 0,
    };
    let rightPoint = {
      vert: Math.round(Math.random() * midHeight + midHeight),
      hori: width,
    };
    let zoneWidth;
    if (difficulty === 1) {
      zoneWidth = 100;
    } else {
      zoneWidth = 80;
    }

    let zone1Height = Math.round((height * Math.random()) / 2 + height / 2);
    let zone1Width = Math.round(width * (3 / 10) * Math.random() + width / 10);
    let startZone1 = {
      vert: zone1Height,
      hori: zone1Width,
    };
    let endZone1 = {
      vert: zone1Height,
      hori: zone1Width + zoneWidth,
    };

    let zone2Height = Math.round((height * Math.random()) / 2 + height / 2);
    let zone2Width = Math.round(
      width * (4 / 10) * Math.random() + width * (5 / 10)
    );
    let startZone2 = {
      vert: zone2Height,
      hori: zone2Width,
    };
    let endZone2 = {
      vert: zone2Height,
      hori: zone2Width + zoneWidth,
    };
    if (difficulty === 1) {
      terrainData.push(recurseBuildTerrain(leftPoint, startZone1));
      terrainData.push([startZone1, endZone1]);
      terrainData.push(recurseBuildTerrain(endZone1, startZone2));
      terrainData.push([startZone2, endZone2]);
      terrainData.push(recurseBuildTerrain(endZone2, rightPoint));
      zone1Left = startZone1.hori;
      zone1Right = endZone1.hori;
      zone2Left = startZone2.hori;
      zone2Right = endZone2.hori;
    } else if (difficulty === 2) {
      terrainData.push(recurseBuildTerrain(leftPoint, startZone1));
      terrainData.push([startZone1, endZone1]);
      terrainData.push(recurseBuildTerrain(endZone1, rightPoint));
      zone1Left = startZone1.hori;
      zone1Right = endZone1.hori;
    }
  }

  function renderTerrain() {
    let context = MyGame.graphics.canvas.getContext("2d");
    context.beginPath();
    for (let section = 0; section < terrainData.length; section++) {
      let segments = terrainData[section];
      for (let point = 0; point < segments.length; point++) {
        let seg = segments[point];
        if (section === 0 && point === 0) {
          context.moveTo(seg.hori, seg.vert);
        } else {
          context.lineTo(seg.hori, seg.vert);
        }
      }
    }
    let lastSegment = terrainData[terrainData.length - 1];
    let lastPoint = lastSegment[lastSegment.length - 1];
    context.lineTo(lastPoint.hori, MyGame.graphics.canvas.height);
    context.lineTo(0, MyGame.graphics.canvas.height);
    context.closePath();
    context.lineWidth = 4;
    context.strokeStyle = "rgba(255, 255, 255, 1)";
    context.stroke();
    context.fillStyle = "rgb(62, 0, 68)";
    context.fill();
  }

  let lastTimeStamp = performance.now();
  let cancelNextRequest = true;

  let myStorage = objects.Storage();

  let myBackground = objects.Logo({
    imageSrc: "assets/caldwell-69.jpg",
    center: { x: graphics.canvas.width / 2, y: graphics.canvas.height / 2 },
    size: { width: 800, height: 800 },
    moveRate: 500 / 1000,
  });
  let victorySound = new Audio();
  victorySound.src = "assets/victory.mp3";
  let crashSound = new Audio();
  crashSound.src = "assets/explode.mp3";

  let myLander = objects.Logo({
    imageSrc: "assets/lander.png",
    center: {
      x: canvas.width / 2,
      y: canvas.height / 16,
    },
    size: { width: 30, height: 30 },
    moveRate: 200,
    rotateRate: 3,
    horizVector: 0,
    vertVector: 0,
    fuel: 100,
  });
  let myText = objects.Text({
    text: "asdf",
    font: "32pt Arial",
    fillStyle: "rgba(255, 255, 255, 255)",
    strokeStyle: "rgba(255, 255, 255, 255)",
    position: { x: 50, y: 100 },
  });
  let mySpeed = objects.Text({
    text: "willchange",
    font: "32pt Arial",
    fillStyle: "rgba(255, 255, 255, 255)",
    strokeStyle: "rgba(255, 255, 255, 255)",
    position: { x: 50, y: 150 },
  });
  let myFuel = objects.Text({
    text: "100",
    font: "32pt Arial",
    fillStyle: "rgba(255, 255, 255, 255)",
    strokeStyle: "rgba(255, 255, 255, 255)",
    position: { x: 50, y: 50 },
  });
  let gameOver = objects.Text({
    text: "Game Over!!!",
    font: "32pt Arial",
    fillStyle: "rgba(255, 255, 255, 255)",
    strokeStyle: "rgba(255, 255, 255, 255)",
    position: {
      x: graphics.canvas.width / 4 + 90,
      y: graphics.canvas.width / 4,
    },
  });
  let win = objects.Text({
    text: "You Win!!!",
    font: "32pt Arial",
    fillStyle: "rgba(255, 255, 255, 255)",
    strokeStyle: "rgba(255, 255, 255, 255)",
    position: {
      x: graphics.canvas.width / 2 - 100,
      y: graphics.canvas.width / 4,
    },
  });
  let scoreText = objects.Text({
    text: "Score: " + score,
    font: "32pt Arial",
    fillStyle: "rgba(255, 255, 255, 255)",
    strokeStyle: "rgba(255, 255, 255, 255)",
    position: {
      x: graphics.canvas.width / 4 + 125,
      y: graphics.canvas.width / 4 + 100,
    },
  });
  let timerText = objects.Text({
    text: "3",
    font: "32pt Arial",
    fillStyle: "rgba(255, 255, 255, 255)",
    strokeStyle: "rgba(255, 255, 255, 255)",
    position: {
      x: graphics.canvas.width / 2,
      y: graphics.canvas.width / 4 + 125,
    },
  });
  let particlesFire = objects.ParticleSystem({
    center: { x: 300, y: 300 },
    size: { mean: 10, stdev: 4 },
    speed: { mean: 50, stdev: 25 },
    lifetime: { mean: 0.5, stdev: 0.25 },
  });
  let renderFire = renderer.ParticleSystem(
    particlesFire,
    graphics,
    "assets/fire.png"
  );
  let particlesThrust = objects.ParticleSystem({
    center: { x: 300, y: 300 },
    size: { mean: 3, stdev: 2 },
    speed: { mean: 200, stdev: 25 },
    lifetime: { mean: 0.1, stdev: 0.05 },
  });
  let renderThrust = renderer.ParticleSystem(
    particlesThrust,
    graphics,
    "assets/fire.png"
  );
  function processInput(elapsedTime) {
    if (!landed) {
      myKeyboard.update(elapsedTime);
      if (myKeyboard.getThrusting()) {
        toRenderThrust = true;
      } else {
        toRenderThrust = false;
      }
    }
  }
  function getAngle(number) {
    let degrees = (number * (180 / Math.PI) + 360) % 360; // Convert radians to degrees and ensure within 0 to 360 range
    return degrees;
  }
  function goodToLand() {
    let colors =
      myText.color == "rgba(0, 255, 0, 255) " &&
      mySpeed.color == "rgba(0, 255, 0, 255) ";

    let inZone1 = myLander.getX > zone1Left && myLander.getX < zone1Right;
    let inZone2 = myLander.getX > zone2Left && myLander.getX < zone2Right;
    let inZone = inZone1 || inZone2;

    let topZone = true;
    if (myLander.getY < 100) {
      topZone = false;
    }
    return colors && inZone && topZone;
  }
  function crashed(lander) {
    if (myLander.getY < 0) {
      return true;
    }
    if (myLander.getX < 0 || myLander.getX > graphics.canvas.width) {
      return true;
    }
    for (let i = 0; i < terrainData.length; i++) {
      for (let j = 0; j < terrainData[i].length - 1; j++) {
        const currentTerrain = terrainData[i][j];
        const nextTerrain = terrainData[i][j + 1];
        const landerX = lander.getX;
        const landerY = lander.getY;

        if (landerX > currentTerrain.hori && landerX < nextTerrain.hori) {
          const b = currentTerrain.vert;
          const m =
            (nextTerrain.vert - currentTerrain.vert) /
            (nextTerrain.hori - currentTerrain.hori);
          const xRelativeToTerrain = landerX - currentTerrain.hori;
          const y = m * xRelativeToTerrain + b;

          if (landerY + 18 > y) {
            return true;
          }
        }
      }
    }
    return false;
  }
  function updateThrustPart(elapsedTime) {
    particlesThrust.setCenter(myLander.center.x, myLander.center.y + 15);
    let yRad = Math.abs(myLander.rotation / Math.PI);
    let yFirst, ySecond;
    if (yRad < 0.5) {
      yFirst = yRad;
      ySecond = 1 - yRad;
    } else {
      yFirst = -yRad;
      ySecond = yRad - 1;
    }
    particlesThrust.setBounds({
      x: {
        first: -0.5,
        second: 0.5,
      },
      y: {
        first: yFirst,
        second: ySecond,
      },
    });
    particlesThrust.update(elapsedTime);
  }

  function update(elapsedTime) {
    particlesFire.update(elapsedTime);
    updateThrustPart(elapsedTime);
    if (getAngle(myLander.rotation) > 355 || getAngle(myLander.rotation) < 5) {
      myText.changeColor("rgba(0, 255, 0, 255) ");
    } else {
      myText.changeColor("rgba(255, 255, 255, 255) ");
    }
    if (myLander.vertVector > -0.2) {
      mySpeed.changeColor("rgba(0, 255, 0, 255) ");
    } else {
      mySpeed.changeColor("rgba(255, 255, 255, 255) ");
    }
    if (myLander.fuel > 0) {
      myFuel.changeColor("rgba(0, 255, 0, 255) ");
    } else {
      myFuel.changeColor("rgba(255, 255, 255, 255) ");
    }
    particlesFire.setCenter(myLander.center.x, myLander.center.y);
    if (crashed(myLander)) {
      landed = true;
      if (goodToLand()) {
        renderWin = true;
        victorySound.play();
        renderGameOver = false;
      } else {
        particlesFire.setCenter(myLander.center.x, myLander.center.y);

        timeOut -= elapsedTime;
        if (timeOut < 0) {
          myLander.center.x = 1500;
          renderCrash = false;
          timeOut = 3000;
        } else {
          renderCrash = true;
        }
        if (!playedCrash) {
          crashSound.play();
          playedCrash = true;
        }

        renderGameOver = true;
        // cancelNextRequest = true; //might be problematic but works for now, yup its problematic
        renderWin = false;
        levelTracker = 1;
        difficulty = 1;
        secondLevel = false;
      }
    }
    if (renderWin) {
      landed = true;
      if (!secondLevel) {
        renderTimer = true;
      }

      if (levelTracker === 2) {
        renderTimer = false;
        secondLevel = true;
        cancelNextRequest = true;
        renderWin = true;
        scoreText.setText(myLander.fuel);
        renderScore = true;
        renderGameOver = false;
        levelTracker = 1;
        difficulty = 1;
        secondLevel = false;
        score += myLander.fuel - myLander.vertVector * myLander.vertVector;
        myStorage.updateLeaderBoard(score.toFixed(2));
      }

      timeOut = timeOut - elapsedTime;
      if (timeOut < 3000) {
        timerText.setTextString("3");
      }
      if (timeOut < 2000) {
        timerText.setTextString("2");
      }
      if (timeOut < 1000) {
        timerText.setTextString("1");
      }
      if (timeOut < 0) {
        renderTimer = false;
        timerText.setTextString("");
        difficulty += 1;
        levelTracker += 1;

        timeOut = 3000;
        if (!secondLevel) {
          run();
        }
      }
    }
    if (!landed) {
      myLander.gravity(elapsedTime);
      myText.setTextWAngle(myLander.rotation);
      myFuel.setText(myLander.fuel);
      mySpeed.setTextSpeed(myLander.vertVector);
      myLander.horizontalMove(elapsedTime);
      myLander.verticalMove(elapsedTime);
    }
  }

  function render() {
    graphics.clear();
    renderer.Logo.render(myBackground);
    renderer.Logo.render(myLander);

    renderer.Text.render(myText);
    renderer.Text.render(myFuel);
    renderer.Text.render(mySpeed);

    if (toRenderThrust) {
      renderThrust.render();
    }
    if (renderCrash) {
      renderFire.render();
    }
    renderTerrain(); //imo looks the best in this order
    if (renderGameOver) {
      renderer.Text.render(gameOver);
    }
    if (renderWin) {
      renderer.Text.render(win);
    }
    if (renderScore) {
      renderer.Text.render(scoreText);
    }
    if (renderTimer) {
      renderer.Text.render(timerText);
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
    if (cancelNextRequest) {
      renderTimer = false;
      render();
    }
  }
  function setControls() {
    let inputs = myStorage.getControls();
    myKeyboard.removeAll();
    myKeyboard.register(inputs.thrust, myLander.moveUp);
    myKeyboard.register(inputs.rotateLeft, myLander.rotateLeft);
    myKeyboard.register(inputs.rotateRight, myLander.rotateRight);
    myKeyboard.register("Escape", function () {
      cancelNextRequest = true;
      game.showScreen("main-menu");
    });
  }
  function initialize() {
    setControls();
    difficulty = 1;
    secondLevel = false;
    renderScore = false;
    levelTracker = 1;
  }
  let myKeyboard = input.Keyboard();
  function run() {
    myKeyboard = input.Keyboard();
    setControls();
    landed = false;
    renderGameOver = false;
    renderWin = false;
    renderScore = false;
    lastTimeStamp = performance.now();
    cancelNextRequest = false;
    renderTimer = false;
    renderCrash = false;
    playedCrash = false;
    terrainData = [];
    myLander.center.x = graphics.canvas.width / 2;
    myLander.center.y = graphics.canvas.height / 16;
    myLander.changeFuel(100);
    myLander.changeVerticalVector(0);
    myLander.changeHorizontalVector(0);
    myLander.resetRotation();
    myLander.rotate45();
    generateTerrain();
    console.log(terrainData);
    //Once we generate terrain difficulty doesnt matter
    difficulty = 1;

    requestAnimationFrame(gameLoop);
  }
  let levelTracker = 1;
  let secondLevel = false;
  return {
    initialize: initialize,
    run: run,
  };
})(
  MyGame.game,
  MyGame.objects,
  MyGame.render,
  MyGame.graphics,
  MyGame.input,
  MyGame.lander
);
//OK So fuel on level 2 is depelting too soon. is it
