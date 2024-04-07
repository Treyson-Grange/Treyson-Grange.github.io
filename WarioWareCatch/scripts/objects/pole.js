MyGame.objects.Pole = function (spec) {
  "use strict";
  let rotation = 0;
  let originalHeight = spec.size.height;
  let imageReady = false;
  let beingHeld = true;
  let beingHeldByBottom = false;
  let image = new Image();
  let timer = Math.floor(Math.random() * (2500 - 500 + 1)) + 500;
  image.onload = function () {
    imageReady = true;
  };
  image.src = spec.imageSrc;
  function fall(elapsedTime) {
    spec.center.y += elapsedTime / 1.2;
  }
  function changePoleHeight() {
    spec.size.height += 1;
  }
  function isOffScreen() {
    return spec.center.y - spec.size.height / 2 > 800;
  }
  function update(elapsedTime) {
    if (!beingHeld && !beingHeldByBottom) {
      fall(elapsedTime);
    } else {
      timer -= elapsedTime;
      if (timer <= 0) {
        beingHeld = false;
      }
    }
  }
  function checkIfCaught() {
    if (spec.center.y <= 700) {
      //we are over the bottom hand.
      if (spec.center.y + spec.size.height / 2 >= 700) {
        beingHeldByBottom = true;
        return true;
      }
    }
    if (spec.center.y > 700) {
      //underneight bottomhand
      if (spec.center.y - spec.size.height / 2 <= 700) {
        beingHeldByBottom = true;
        return true;
      }
    }
    return false;
  }

  function updateTimer() {
    timer = Math.floor(Math.random() * (2500 - 500 + 1)) + 500;
  }
  function reset(polesCaught) {
    timer = Math.floor(Math.random() * (2500 - 500 + 1)) + 500;
    beingHeldByBottom = false;
    beingHeld = true;
    spec.center.y = 100;

    if (polesCaught > 0) {
      spec.size.height = spec.size.height - polesCaught * 20;

      if (spec.size.height < originalHeight / 4 + 10) {
        spec.size.height = originalHeight;
      } else {
        originalHeight = spec.size.height;
      }
    }
  }
  let api = {
    isOffScreen: isOffScreen,
    updateTimer: updateTimer,
    reset: reset,
    update: update,
    fall: fall,
    changePoleHeight: changePoleHeight,
    checkIfCaught: checkIfCaught,
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
    get goingDown() {
      return !beingHeld;
    },
    get height() {
      return spec.size.height;
    },
  };
  return api;
};
