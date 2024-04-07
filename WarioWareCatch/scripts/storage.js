MyGame.objects.Storage = function (spec) {
  "use strict";

  let asdf = 0;
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
      return leaderboard;
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
        break;
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
  function updateHTML() {
    let leaderboard = getLeaderBoard();
    if (leaderboard) {
      document.getElementById("first").innerHTML = leaderboard.first;
      document.getElementById("second").innerHTML = leaderboard.second;
      document.getElementById("third").innerHTML = leaderboard.third;
      document.getElementById("fourth").innerHTML = leaderboard.fourth;
      document.getElementById("fifth").innerHTML = leaderboard.fifth;
    }
  }

  let api = {
    updateHTML: updateHTML,
    getLeaderBoard: getLeaderBoard,
    updateLeaderBoard: updateLeaderBoard,
  };
  return api;
};
