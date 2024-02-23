/**
 * Function isScrolledToBottom
 * Footer listener.
 * Input: None
 * Output: Boolean
 */
function isScrolledToBottom() {
  console.log(
    window.innerHeight + window.scrollY >= document.body.offsetHeight
  );
  return window.innerHeight + window.scrollY >= document.body.offsetHeight;
}

const darkModeToggle = document.getElementById("dark-mode-toggle");
const body = document.body;

darkModeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  // Toggle icons
  darkModeToggle.classList.toggle("dark-mode-toggle");
  darkModeToggle.classList.toggle("light-mode-toggle");

  var moonIcon = document.querySelector("#dark-mode-toggle .fa-moon");
  var sunIcon = document.querySelector("#dark-mode-toggle .fa-sun");

  // Toggle the visibility of the icons
  moonIcon.style.display =
    moonIcon.style.display === "none" ? "inline-block" : "none";
  sunIcon.style.display =
    sunIcon.style.display === "none" ? "inline-block" : "none";
});

//Set up event listener for the footer.
window.addEventListener("scroll", function () {
  if (isScrolledToBottom()) {
    document.getElementById("footer").style.display = "block";
  } else {
    document.getElementById("footer").style.display = "none";
  }
});
