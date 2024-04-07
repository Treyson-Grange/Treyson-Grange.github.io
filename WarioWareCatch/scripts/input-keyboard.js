// ------------------------------------------------------------------
// This is the input handler used to distribute inputs to the game objects
// ------------------------------------------------------------------
MyGame.input = (function () {
  "use strict";
  function Keyboard() {
    let that = {
      keys: {},
      handlers: {},
      thrusting: false,
    };
    function keyPress(e) {
      that.keys[e.key] = e.timeStamp;
    }
    function keyRelease(e) {
      delete that.keys[e.key];
    }
    that.getThrusting = function () {
      return that.thrusting;
    };
    // ------------------------------------------------------------------
    // Allows the client code to register a keyboard handler
    // ------------------------------------------------------------------
    that.register = function (key, handler) {
      that.handlers[key] = handler;
    };
    that.removeAll = function () {
      that.keys = {};
      that.handlers = {};
    };
    // ------------------------------------------------------------------
    // Allows the client to invoke all the handlers for the registered key/handlers.
    // ------------------------------------------------------------------
    that.update = function (elapsedTime) {
      if (that.thrusting === true) {
        that.thrusting = false;
      }
      for (let key in that.keys) {
        if (that.keys.hasOwnProperty(key)) {
          if (that.handlers[key]) {
            that.handlers[key](elapsedTime);

            // if (key == JSON.parse(localStorage.getItem("controls")).thrust) {
            //   that.thrusting = true;
            // } else {
            //   that.thrusting = false;
            // }
          }
        }
      }
    };
    // These are used to keep track of which keys are currently pressed
    window.addEventListener("keydown", keyPress);
    window.addEventListener("keyup", keyRelease);
    return that;
  }
  return {
    Keyboard: Keyboard,
  };
})();
