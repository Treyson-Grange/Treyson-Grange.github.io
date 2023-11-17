document.addEventListener("DOMContentLoaded", function () {
    // Set the past event time (replace with your desired past time)
    const pastEventTime = new Date("2023-11-16T12:00:00").getTime();

    // Update the timer every second
    const timerInterval = setInterval(updateTimer, 1000);

    function updateTimer() {
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - pastEventTime;

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        document.getElementById("timer").innerHTML =
            days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    }
});
