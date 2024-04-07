MyGame.graphics = (function () {
  "use strict";

  let canvas = document.getElementById("id-canvas");
  let context = canvas.getContext("2d");

  function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  // --------------------------------------------------------------
  //
  // Draws a texture to the canvas with the following specification:
  //    image: Image
  //    center: {x: , y: }
  //    size: { width: , height: }
  //
  // --------------------------------------------------------------
  function drawTexture(image, center, rotation, size) {
    context.save();

    context.translate(center.x, center.y);
    context.rotate(rotation);
    context.translate(-center.x, -center.y);

    context.drawImage(
      image,
      center.x - size.width / 2,
      center.y - size.height / 2,
      size.width,
      size.height
    );

    context.restore();
  }

  function drawText(spec) {
    context.save();

    context.font = spec.font;
    context.fillStyle = spec.fillStyle;
    context.strokeStyle = spec.strokeStyle;
    context.textBaseline = "top";

    context.translate(spec.position.x, spec.position.y);
    context.rotate(spec.rotation);
    context.translate(-spec.position.x, -spec.position.y);

    context.fillText(spec.text, spec.position.x, spec.position.y);
    context.strokeText(spec.text, spec.position.x, spec.position.y);

    context.restore();
  }
  function drawLine(spec) {
    context.beginPath();
    context.lineWidth = spec.width;
    context.strokeStyle = spec.strokeStyle;
    context.moveTo(spec.begin_x, spec.begin_y);
    context.lineTo(spec.end_x, spec.end_y);
    context.closePath();
    context.stroke();
  }
  function fill(style) {
    context.save();
    context.fillStyle = style;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
  }
  function drawParticle(image, center, rotation, size) {
    context.save();
    context.translate(center.x, center.y);
    context.rotate(rotation);
    context.translate(-center.x, -center.y);
    context.drawImage(
      image,
      center.x - size.x / 2,
      center.y - size.y / 2,
      size.x,
      size.y
    );
    context.restore();
  }

  let api = {
    get canvas() {
      return canvas;
    },
    clear: clear,
    drawTexture: drawTexture,
    drawText: drawText,
    drawLine: drawLine,
    fill: fill,
    drawParticle: drawParticle,
  };

  return api;
})();
