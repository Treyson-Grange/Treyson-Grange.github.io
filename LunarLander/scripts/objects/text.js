// --------------------------------------------------------------
//
// Creates a Text object, with functions for managing state.
//
// spec = {
//    text: ,
//    font: ,
//    fillStyle: ,
//    strokeStyle: ,
//    position: { x: , y: }
// }
//
// --------------------------------------------------------------
MyGame.objects.Text = function (spec) {
  "use strict";

  let rotation = 0;

  function updateRotation(howMuch) {
    rotation += howMuch;
  }
  function setTextWAngle(text) {
    spec.text = getAngle(text).toFixed(2);
  }
  function setTextSpeed(text) {
    spec.text = Math.abs(text * 10).toFixed(2);
  }
  function setText(text) {
    spec.text = text.toFixed(2);
  }
  function setTextString(text) {
    spec.text = text;
  }
  function getAngle(number) {
    let degrees = (number * (180 / Math.PI) + 360) % 360; // Convert radians to degrees and ensure within 0 to 360 range
    return degrees;
  }
  function changeColor(rgb) {
    spec.fillStyle = rgb;
    spec.strokeStyle = rgb;
  }

  let api = {
    updateRotation: updateRotation,
    setTextSpeed: setTextSpeed,
    changeColor: changeColor,
    setTextWAngle: setTextWAngle,
    setText: setText,
    setTextString: setTextString,
    get rotation() {
      return rotation;
    },
    get position() {
      return spec.position;
    },
    get rotationDegrees() {
      return getAngle(rotation).toFixed(2);
    },
    get text() {
      return spec.text;
    },
    get font() {
      return spec.font;
    },
    get fillStyle() {
      return spec.fillStyle;
    },
    get strokeStyle() {
      return spec.strokeStyle;
    },
    get color() {
      return spec.fillStyle;
    },
  };

  return api;
};
