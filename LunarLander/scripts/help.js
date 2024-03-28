MyGame.screens["help"] = (function (game) {
  "use strict";

  function initialize() {
    document
      .getElementById("id-help-back")
      .addEventListener("click", function () {
        game.showScreen("main-menu");
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
