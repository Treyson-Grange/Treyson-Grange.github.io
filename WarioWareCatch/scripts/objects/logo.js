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
  let newImage = new Image();
  image.onload = function () {
    imageReady = true;
  };
  newImage.onload = function () {
    imageReady = true;
  };
  image.src = spec.imageSrc;
  newImage.src = spec.secondImageSrc;
  function catchPole() {
    image.src = newImage.src;
  }
  function reset() {
    image.src = spec.imageSrc;
  }

  let api = {
    catchPole: catchPole,
    reset: reset,
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
