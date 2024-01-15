// Get the control element
  const controlElement = document.getElementById('controls-back');
  // Variables to store scroll position and timeout reference
  let lastScrollTop = 0;
  let timeoutRef;

  // Function to handle scroll events
  function handleScroll() {
      const offset = -200; // You can adjust this value based on your needs
    const scrollTop = window.scrollY || document.documentElement.scrollTop + offset;

    // Check the scroll direction
    if (scrollTop > lastScrollTop) {
      // Scrolling down
      controlElement.style.opacity = '0';
    } else {
      // Scrolling up
      controlElement.style.opacity = '1';
    }

    // Update the last scroll position
    lastScrollTop = scrollTop;
  }

  // Attach the scroll event listener
  window.addEventListener('scroll', handleScroll);

