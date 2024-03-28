MyGame.objects.Storage = function (spec) {
  "use strict";

  let asdf = 0;
  function getControls() {
    let controls = JSON.parse(localStorage.getItem("controls"));
    if (controls) {
      return controls;
    } else {
      controls = {
        thrust: "ArrowUp",
        rotateRight: "ArrowRight",
        rotateLeft: "ArrowLeft",
      };
      localStorage.setItem("controls", JSON.stringify(controls));
      return controls;
    }
  }
  function update(objControls) {
    localStorage.setItem("controls", objControls);
  }
  function getLeaderBoard() {
    let storedLeaderboardJSON = localStorage.getItem("leaderboard");
    if (storedLeaderboardJSON) {
      return JSON.parse(storedLeaderboardJSON);
    } else {
      var leaderboard = {
        first: 0,
        second: 0,
        third: 0,
        fourth: 0,
        fifth: 0,
      };
      localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    }
  }
  function updateLeaderBoard(score) {
    let leaderboard = getLeaderBoard();
    let keys = Object.keys(leaderboard);
    let values = Object.values(leaderboard);
    for (let i = 0; i < keys.length; i++) {
      if (score > values[i]) {
        let temp = values[i];
        values[i] = score;
        score = temp;
      }
    }
    leaderboard = {
      first: values[0],
      second: values[1],
      third: values[2],
      fourth: values[3],
      fifth: values[4],
    };
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  }

  let api = {
    update: update,
    getControls: getControls,
    getLeaderBoard: getLeaderBoard,
    updateLeaderBoard: updateLeaderBoard,
  };
  return api;
};
