const darkModeToggle = document.getElementById("dark-mode-toggle");
const body = document.body;
const modeIcon = document.getElementById("mode-icon");

const isDarkMode = localStorage.getItem("darkModeEnabled") === "true";
/**
 * Function setDarkMode
 * checks if localStorage has it as darkmode or not and changes it based on that.
 * Input: enabled: boolean
 * Output: Null
 */
function setDarkMode(enabled) {
  if (enabled) {
    body.classList.add("dark-mode");
    darkModeToggle.classList.add("light-mode-toggle");
    modeIcon.classList.remove("fa-moon");
    modeIcon.classList.add("fa-sun");
  } else {
    body.classList.remove("dark-mode");
    darkModeToggle.classList.remove("light-mode-toggle");
    modeIcon.classList.remove("fa-sun");
    modeIcon.classList.add("fa-moon");
  }
}

setDarkMode(isDarkMode);

darkModeToggle.addEventListener("click", () => {
  const darkModeEnabled = body.classList.toggle("dark-mode");
  setDarkMode(darkModeEnabled);
  localStorage.setItem("darkModeEnabled", darkModeEnabled);
});
