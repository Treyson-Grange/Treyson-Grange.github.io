// ------------------------------------------------------------------
//
// This is the game object.  Everything about the game is located in
// this object.
//
// ------------------------------------------------------------------

MyGame.game = (function (screens) {
  "use strict";

  //------------------------------------------------------------------
  //
  // This function is used to change to a new active screen.
  //
  //------------------------------------------------------------------
  function showScreen(id) {
    //
    // Remove the active state from all screens.  There should only be one...
    let active = document.getElementsByClassName("active");
    for (let screen = 0; screen < active.length; screen++) {
      active[screen].classList.remove("active");
    }
    //
    // Tell the screen to start actively running
    screens[id].run();
    //
    // Then, set the new screen to be active
    document.getElementById(id).classList.add("active");
  }

  //------------------------------------------------------------------
  //
  // This function performs the one-time game initialization.
  //
  //------------------------------------------------------------------
  function initialize() {
    let screen = null;
    for (screen in screens) {
      if (screens.hasOwnProperty(screen)) {
        screens[screen].initialize();
      }
    }
    showScreen("main-menu");
  }

  return {
    initialize: initialize,
    showScreen: showScreen,
  };
})(MyGame.screens);
