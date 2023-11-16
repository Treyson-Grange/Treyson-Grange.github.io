/** 
 * Function isScrolledToBottom
 * Input: None
 * Output: Boolean 
*/
function isScrolledToBottom() {
    console.log(window.innerHeight + window.scrollY >= document.body.offsetHeight);
    return window.innerHeight + window.scrollY >= document.body.offsetHeight;
}

//Set up event listener for the footer.
window.addEventListener('scroll', function () {
    if (isScrolledToBottom()) {
        document.getElementById('footer').style.display = 'block';
    } else {
        document.getElementById('footer').style.display = 'none';
    }
});