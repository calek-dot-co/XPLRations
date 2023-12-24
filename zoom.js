// COLUMN SETUP

let currentColumns = 3; // Initial number of columns



// KEYBOARD PRESSES

// Event listener for key presses
document.addEventListener("keydown", function (event) {

  // Check if the pressed key is the 'Minus' key
  if (event.key === 'Minus' || event.key === '-'  || event.key === 37) {
    // Call the addColumn function
    addColumn();
    // Add a class to 'buttonMinus' for X seconds
    addClassForDurationMinus('buttonActive', 100);
    
  }

  // Check if the pressed key is the 'Equal' key
  if (event.key === 'Equal' || event.key === '=' || event.key === 39) {
    // Call the removeColumn function
    removeColumn();
    // Add a class to 'buttonPlus' for X seconds
    addClassForDurationPlus('buttonActive', 100);
  }
});



// CHANGE COLUMN VARIABLE ONBUTTON CLICK

function addColumn() {
  if (currentColumns < 6) {
    currentColumns++;
    updateGrid();
    updateURL();
  }
}

function removeColumn() {
  if (currentColumns > 1) {
    currentColumns--;
    updateGrid();
    updateURL();
  }
}




// WRITE VARIABLE TO URL QUERY

function updateURL() {
  // Update the URL with the new value of currentColumns
  const urlSearchParams = new URLSearchParams(window.location.search);
  urlSearchParams.set('view', currentColumns);

  // Replace the current URL with the updated one
  const newURL = `${window.location.pathname}?${urlSearchParams.toString()}`;
  window.history.replaceState({}, '', newURL);
}




// GRID LOGIC

function updateGrid() {
  const imageGrid = document.getElementById('imageGrid');
  imageGrid.style.gridTemplateColumns = `repeat(${currentColumns}, 1fr)`;
  const mapElement = document.getElementById('map');
  const infoElements = document.querySelectorAll('.info');

  // Edit things based on view levels 
  if (currentColumns === 6) {
    buttonMinus.classList.add('buttonActive16');
    window.scrollTo(0, 0);
    mapElement.style.zIndex = '5';
  } else if (currentColumns === 5) {
    buttonMinus.classList.remove('buttonActive16');
    mapElement.style.zIndex = '-5';
  } else if (currentColumns === 2) {
    buttonPlus.classList.remove('buttonActive16');
    images.style.paddingLeft = '0';
    images.style.paddingRight = '0';
    infoElements.forEach(element => {
      element.style.display = 'none';
    });
  } else if (currentColumns === 1) {
    buttonPlus.classList.add('buttonActive16');
    images.style.paddingLeft = '15vw';
    images.style.paddingRight = '15vw';
    infoElements.forEach(element => {
      element.style.display = 'block';
    });
    console.log('Test UpdateGrid');
  } 

}


// DURATION OF CLASS

// Function to add a class to an element with ID 'buttonMinus' for a short duration
function addClassForDurationMinus(className, duration) {
  const element = document.getElementById('buttonMinus');
  if (element) {
    element.classList.add(className);
    setTimeout(() => {
      element.classList.remove(className);
    }, duration);
  }
}
// Function to add a class to an element with ID 'buttonPlus' for a short duration
function addClassForDurationPlus(className, duration) {
  const element = document.getElementById('buttonPlus');
  if (element) {
    element.classList.add(className);
    setTimeout(() => {
      element.classList.remove(className);
    }, duration);
  }
}




// READ URL QUERY AND SAVE TO VARIABLE

document.addEventListener("DOMContentLoaded", function() {
    console.log('Page loaded. Running DOMContentLoaded. Current columns:', currentColumns);


    // Get the current URL
    var urlParams = new URLSearchParams(window.location.search);
    console.log("Current URL: " + urlParams);
    
    // Get the value of the 'view' parameter
    var viewValue = urlParams.get('view');
    console.log("Current View: " + viewValue);
    
    // Set the value of the 'currentColumns' variable
    currentColumns = viewValue ? parseInt(viewValue, 10) : 3; // Use a default value if 'view' is not present
    console.log('Updating grid. Current columns:', currentColumns);

    // Update the grid based on the initial 'currentColumns' value
    updateGrid();


    console.log('Grid updated. Current columns:', currentColumns);

});

