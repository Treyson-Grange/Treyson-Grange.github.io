// --------------------------------------------------------------
//
// Creates a Logo object, with functions for managing state.
//
// spec = {
//    imageSrc: ,   // Web server location of the image
//    center: { x: , y: },
//    size: { width: , height: }
// }
//
// --------------------------------------------------------------
MyGame.objects.Logo = function (spec) {
  "use strict";

  let rotation = 0;
  let imageReady = false;
  let image = new Image();
  let thrustSound = new Audio("assets/thrust.mp3");

  image.onload = function () {
    imageReady = true;
  };
  image.src = spec.imageSrc;
  function gravity(elapsedTime) {
    spec.vertVector -= (elapsedTime / 1000) * 0.3;
  }
  function rotateRight(elapsedTime) {
    rotation += spec.rotateRate * (elapsedTime / 5000);
  }
  function rotateLeft(elapsedTime) {
    rotation -= spec.rotateRate * (elapsedTime / 5000);
  }
  function rotate45() {
    //not actually 45 degrees (for ease of testing and makes game easier)
    rotation = Math.PI / 2 - 15;
  }
  function moveUp(elapsedTime) {
    thrustSound.play();
    if (spec.fuel > 0) {
      spec.vertVector += (elapsedTime / 1000) * Math.cos(rotation);
      spec.horizVector += (elapsedTime / 1000) * Math.sin(rotation);
      spec.fuel -= 0.1;
    } else {
      spec.fuel = 0;
    }
  }
  function moveTo(pos) {
    spec.center.x = pos.x;
    spec.center.y = pos.y;
  }
  function horizontalMove(elapsedTime) {
    spec.center.x += spec.moveRate * (elapsedTime / 1000) * spec.horizVector;
  }
  function verticalMove(elapsedTime) {
    spec.center.y -= spec.moveRate * (elapsedTime / 1000) * spec.vertVector;
  }
  function changeVerticalVector(vector) {
    spec.vertVector = vector;
  }
  function changeHorizontalVector(vector) {
    spec.horizVector = vector;
  }
  function resetRotation() {
    rotation = 0;
  }
  function changeFuel(num) {
    spec.fuel = num;
  }

  let api = {
    rotateLeft: rotateLeft,
    rotateRight: rotateRight,
    gravity: gravity,
    moveUp: moveUp,
    moveTo: moveTo,
    horizontalMove: horizontalMove,
    verticalMove: verticalMove,
    changeVerticalVector: changeVerticalVector,
    changeHorizontalVector: changeHorizontalVector,
    resetRotation: resetRotation,
    changeFuel: changeFuel,
    rotate45: rotate45,
    get fuel() {
      return spec.fuel;
    },
    get imageReady() {
      return imageReady;
    },
    get rotation() {
      return rotation;
    },
    get image() {
      return image;
    },
    get center() {
      return spec.center;
    },
    get size() {
      return spec.size;
    },
    get vertVector() {
      return spec.vertVector;
    },
    get getY() {
      return spec.center.y;
    },
    get getX() {
      return spec.center.x;
    },
  };

  return api;
};
