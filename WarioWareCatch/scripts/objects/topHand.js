MyGame.objects.TopHand = function (spec) {
  "use strict";

  let rotation = 0;
  let imageReady = false;
  let image = new Image();
  let newImage = new Image();
  image.onload = function () {
    imageReady = true;
  };
  newImage.onload = function () {
    imageReady = true;
  };
  image.src = spec.imageSrc;
  newImage.src = spec.secondImageSrc;
  function letGO() {
    image.src = spec.secondImageSrc;
  }
  function reset() {
    image.src = spec.imageSrc;
  }

  let api = {
    reset: reset,
    letGO: letGO,
    moveTo: moveTo,
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
  };

  return api;
};
