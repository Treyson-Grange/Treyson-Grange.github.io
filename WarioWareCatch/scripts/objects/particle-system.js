MyGame.objects.ParticleSystem = function (spec) {
  "use strict";
  let nextName = 1;
  let poleHeight = 200;
  let particles = {};
  let origin = {
    x: spec.center.x,
    y: spec.center.y,
  };
  let bounds = {
    x: {
      first: -1,
      second: 1,
    },
    y: {
      first: -1,
      second: 1,
    },
  };
  function create() {
    let size = Random.nextGaussian(spec.size.mean, spec.size.stdev);

    let directionX = Math.random() < 0.5 ? -1 : 1;

    let directionY = Random.nextGaussian(-0.5, 0.5);

    let length = Math.sqrt(directionX * directionX + directionY * directionY);
    directionX /= length;
    directionY /= length;

    let centerY = origin.y + Math.random() * poleHeight - poleHeight / 2;

    let p = {
      center: { x: origin.x, y: centerY },
      size: { x: size, y: size },
      direction: { x: directionX, y: directionY },
      speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev),
      rotation: 0,
      lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),
      alive: 0,
    };
    return p;
  }

  function update(elapsedTime) {
    let removeMe = [];

    elapsedTime = elapsedTime / 1000;
    Object.getOwnPropertyNames(particles).forEach(function (
      value,
      index,
      array
    ) {
      let particle = particles[value];
      particle.alive += elapsedTime;
      particle.center.x += elapsedTime * particle.speed * particle.direction.x;
      particle.center.y += elapsedTime * particle.speed * particle.direction.y;
      particle.rotation += particle.speed / 500;
      if (particle.alive > particle.lifetime) {
        removeMe.push(value);
      }
    });
    for (let particle = 0; particle < removeMe.length; particle++) {
      delete particles[removeMe[particle]];
    }
    removeMe.length = 0;
    for (let particle = 0; particle < 1; particle++) {
      particles[nextName++] = create();
    }
  }
  function setCenter(x, y) {
    origin.x = x;
    origin.y = y;
  }
  function setBounds(newBounds) {
    bounds = {
      x: {
        first: newBounds.x.first,
        second: newBounds.x.second,
      },
      y: {
        first: newBounds.y.first,
        second: newBounds.y.second,
      },
    };
  }
  function updatePoleHeight(height) {
    poleHeight = height;
  }
  let api = {
    update: update,
    updatePoleHeight: updatePoleHeight,
    setCenter: setCenter,
    setBounds: setBounds,
    get particles() {
      return particles;
    },
  };
  return api;
};
