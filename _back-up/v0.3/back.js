
// KEYBOARD PRESSES

// Event listener for key presses
document.addEventListener("keydown", function (event) {
  // Check if the pressed key is the 'Minus' key
  if (event.key === 'b') {
    // Navigate to preview page
    history.back()
  }
});





// CHECK IF BACK IS THE SAME DOMAIN

document.addEventListener('DOMContentLoaded', function() {
    // CHECK IF BACK IS THE SAME DOMAIN
    document.getElementById('backButton').addEventListener('click', function() {
        // Get the previous URL from the browser's history
        var previousUrl = document.referrer;

        // Check if the previous URL is on the same domain
        if (isSameDomain(previousUrl)) {
            // If on the same domain, go back
            window.history.back();
        } else {
            // If not on the same domain, go to www.example.com
            window.location.href = 'https://explorations.calek.co';
        }
    });

    // Function to check if the given URL is on the same domain
    function isSameDomain(url) {
        var currentDomain = window.location.hostname;
        var urlDomain = new URL(url).hostname;

        return currentDomain === urlDomain;
    }
});





