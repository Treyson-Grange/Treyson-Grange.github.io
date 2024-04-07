MyGame.screens['high-scores'] = (function(game) {
    'use strict';
    
    function initialize() {
        document
      .getElementById("id-high-scores-back")
      .addEventListener("click", function () {
        game.showScreen("main-menu");
      });
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    if (leaderboard) {
      document.getElementById("first").innerHTML = leaderboard.first;
      document.getElementById("second").innerHTML = leaderboard.second;
      document.getElementById("third").innerHTML = leaderboard.third;
      document.getElementById("fourth").innerHTML = leaderboard.fourth;
      document.getElementById("fifth").innerHTML = leaderboard.fifth;
    } else {
      document.getElementById("first").innerHTML = "0";
      document.getElementById("second").innerHTML = "0";
      document.getElementById("third").innerHTML = "0";
      document.getElementById("fourth").innerHTML = "0";
      document.getElementById("fifth").innerHTML = "0";
      localStorage.setItem(
        "leaderboard",
        JSON.stringify({ first: 0, second: 0, third: 0, fourth: 0, fifth: 0 })
      );
    }
    }
    
    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }
    
    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));
