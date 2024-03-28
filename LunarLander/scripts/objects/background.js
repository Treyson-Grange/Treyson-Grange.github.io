MyGame.objects.Background = function (spec) {
  "user strict";

  let imageReady = false;
  let image = new Image();

  image.onload = function () {
    imageReady = true;
  };
  image.src = spec.imageSrc;
};
