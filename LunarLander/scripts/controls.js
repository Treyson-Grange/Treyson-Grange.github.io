MyGame.screens["controls"] = (function (game) {
  "use strict";

  function initialize() {
    let controls = JSON.parse(localStorage.getItem("controls"));
    document.getElementById("thrustKey").innerHTML = controls["thrust"];
    document.getElementById("rotateRKey").innerHTML = controls["rotateRight"];
    document.getElementById("rotateLKey").innerHTML = controls["rotateLeft"];

    document
      .getElementById("id-control-back")
      .addEventListener("click", function () {
        game.showScreen("main-menu");
      });

    document
      .getElementById("thrustChange")
      .addEventListener("click", function (event) {
        event.target.textContent = "Press a key...";
        event.target.style.cursor = "not-allowed";
        event.target.disabled = true;
        document.removeEventListener("keydown", handleKeyPress);
        document.addEventListener("keydown", handleKeyPress);

        function handleKeyPress(event) {
          const newKey = event.key;
          document.getElementById("thrustKey").innerHTML = newKey;

          let newControls = {
            thrust: newKey,
            rotateLeft: controls.rotateLeft,
            rotateRight: controls.rotateRight,
          };

          localStorage.setItem("controls", JSON.stringify(newControls));
          controls = JSON.parse(localStorage.getItem("controls"));
          document.removeEventListener("keydown", handleKeyPress);
        }
      });
    document
      .getElementById("leftChange")
      .addEventListener("click", function (event) {
        event.target.textContent = "Press a key...";
        event.target.style.cursor = "not-allowed";
        event.target.disabled = true;
        document.removeEventListener("keydown", handleKeyPress);
        document.addEventListener("keydown", handleKeyPress);

        function handleKeyPress(event) {
          const newKey = event.key;

          document.getElementById("rotateLKey").innerHTML = newKey;

          let newControls = {
            thrust: controls.thrust,
            rotateLeft: newKey,
            rotateRight: controls.rotateRight,
          };
          localStorage.setItem("controls", JSON.stringify(newControls));
          controls = JSON.parse(localStorage.getItem("controls"));
          document.removeEventListener("keydown", handleKeyPress);
        }
      });
    document
      .getElementById("rightChange")
      .addEventListener("click", function (event) {
        event.target.textContent = "Press a key...";
        event.target.style.cursor = "not-allowed";
        event.target.disabled = true;
        document.removeEventListener("keydown", handleKeyPress);
        document.addEventListener("keydown", handleKeyPress);

        function handleKeyPress(event) {
          const newKey = event.key;
          document.getElementById("rotateRKey").innerHTML = newKey;

          let newControls = {
            thrust: controls.thrust,
            rotateLeft: controls.rotateLeft,
            rotateRight: newKey,
          };
          localStorage.setItem("controls", JSON.stringify(newControls));
          controls = JSON.parse(localStorage.getItem("controls"));
          document.removeEventListener("keydown", handleKeyPress);
        }
      });
  }
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      game.showScreen("main-menu");
    }
  });

  function run() {
    //
    // I know this is empty, there isn't anything to do.
  }

  return {
    initialize: initialize,
    run: run,
  };
})(MyGame.game);
