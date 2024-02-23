const darkModeToggle = document.getElementById("dark-mode-toggle");
const body = document.body;

// Check if dark mode preference is stored in localStorage
const isDarkMode = localStorage.getItem("darkModeEnabled") === "true";

// Function to set dark mode
function setDarkMode(enabled) {
  if (enabled) {
    body.classList.add("dark-mode");
    darkModeToggle.classList.add("light-mode-toggle");
  } else {
    body.classList.remove("dark-mode");
    darkModeToggle.classList.remove("light-mode-toggle");
  }
}

// Set dark mode based on stored preference
setDarkMode(isDarkMode);

// Event listener for toggling dark mode
darkModeToggle.addEventListener("click", () => {
  const darkModeEnabled = body.classList.toggle("dark-mode");

  // Toggle icons
  darkModeToggle.classList.toggle("dark-mode-toggle");
  darkModeToggle.classList.toggle("light-mode-toggle");

  // Store the user's preference in localStorage
  localStorage.setItem("darkModeEnabled", darkModeEnabled);
});
