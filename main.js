function isScrolledToBottom() {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight;
}

// Show the footer when scrolling to the bottom
window.addEventListener('scroll', function () {
    if (isScrolledToBottom()) {
        document.getElementById('footer').style.display = 'block';
    } else {
        document.getElementById('footer').style.display = 'none';
    }
});