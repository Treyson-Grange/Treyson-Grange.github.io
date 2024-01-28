let events = [];
let lastTimestamp = 0;

function gameLoop(timestamp) {
  const elapsedTime = timestamp - lastTimestamp;

  update(elapsedTime);
  render();

  lastTimestamp = timestamp;

  requestAnimationFrame(gameLoop);
}

function update(elapsedTime) {
  //It is in the update function where any active events are updated.
  events.forEach((event) => {
    if (event.times === 0) {
      const indexToRemove = events.indexOf(event);
      if (indexToRemove !== -1) {
        events.splice(indexToRemove, 1);
      }
    }
    event.elapsedTime += elapsedTime;
    if (event.elapsedTime >= event.interval) {
      event.elapsedTime -= event.interval;
      event.times--;
      event.torender = true;
    }
  });
}

function render() {
  //It is in the render function where any events that need reporting are displayed.
  events.forEach((event) => {
    if (event.torender) {
      const outputPanel = document.getElementById("outputPanel");
      outputPanel.innerHTML += `Event: ${event.name} (${event.times} remaining)<br>`;
      outputPanel.scrollTop = outputPanel.scrollHeight;
      event.torender = false;
    }
  });
}

function processInput() {
  const eventName = document.getElementById("eventName").value;
  const interval = parseInt(document.getElementById("interval").value);
  const times = parseInt(document.getElementById("times").value);

  if (eventName && !isNaN(interval) && !isNaN(times)) {
    events.push({
      name: eventName,
      interval: interval,
      times: times,
      elapsedTime: 0,
      torender: false, //ready to render or not
    });
  }
}

function logEvent(name, times) {}

requestAnimationFrame(gameLoop);
