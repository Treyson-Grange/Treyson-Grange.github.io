MyGame.render.ParticleSystem = function (system, graphics, imageSrc) {
  "use strict";
  let image = new Image();
  let isReady = false;
  image.onload = function () {
    isReady = true;
  };
  image.src = imageSrc;
  function render() {
    if (isReady) {
      Object.getOwnPropertyNames(system.particles).forEach(function (value) {
        let particle = system.particles[value];
        graphics.drawParticle(
          image,
          particle.center,
          particle.rotation,
          particle.size
        );
      });
    }
  }
  return {
    render: render,
  };
};
