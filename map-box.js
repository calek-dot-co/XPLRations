//-----------------------------------------------------------
// Map config and settings

mapboxgl.accessToken = 'pk.eyJ1IjoibHVrZWNhaXNoc2FkbGVrIiwiYSI6ImNscTVuMnI1cjAxN2kydnM5dXNveGJub24ifQ.KUqrzudfmNeHhF1hHEehJQ'; 

const map = new mapboxgl.Map({
  container: 'map',
  // Replace YOUR_STYLE_URL with your style URL.
  style: 'mapbox://styles/lukecaishsadlek/clq72rpek003e01pjcvxcfv63', 
  center: [25, 48], //also design default
  zoom: 4.2,
});



//-----------------------------------------------------------



// Set map zoom based on screen size

var mq = window.matchMedia( "(min-width: 600px)" );

if (mq.matches){
    map.setZoom(4.2); //set map zoom level for desktop size
} else {
    map.setZoom(3.5); //set map zoom level for mobile size
    map.setCenter([21, 42])
};




//-----------------------------------------------------------




// Custom pin image

map.loadImage('pins.png', (error, image) => {
    if (error) throw error;
    map.addImage('custom-icon', image);
});

// Map controls

var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');



//-----------------------------------------------------------




// On map load, add pins


map.once('load', () => {
    map.resize();

    // Load GeoJSON data
    map.addSource('features', {
        type: 'geojson',
        data: 'pins.geojson'  // Path to GeoJSON file
    });

    // Add a layer for the GeoJSON data
    map.addLayer({
        id: 'locations-layer',
        type: 'symbol',
        source: 'features',
        layout: {
            'icon-image': 'custom-icon',  // Marker image
            'icon-allow-overlap': true,
            'icon-size': .5, // Scale (e.g., 1.5 for 1.5 times larger)
            'icon-anchor': 'bottom' // Anchor position
        }
    });
});




//-----------------------------------------------------------




// Pin pop-up


let currentPopup = null;
let currentOverlay = null;

// Add an event listener that runs when a user clicks on the map element.
map.on('click', (event) => {
    const features = map.queryRenderedFeatures(event.point, {
        layers: ['locations-layer']
    });
    
    // Close overlay if no features are clicked and overlay exists
    if (!features.length) {
        if (currentOverlay) {
            document.body.removeChild(currentOverlay);
            currentOverlay = null;
            document.getElementById('panel').classList.remove('active');
        }
        return;
    }

    const feature = features[0];

    // Close existing popup or overlay
    if (currentPopup) {
        currentPopup.remove();
    }
    if (currentOverlay) {
        document.body.removeChild(currentOverlay);
        document.getElementById('panel').classList.remove('active');
    }

    // Desktop version (window width >= 601px)
    if (window.innerWidth >= 601) {
        currentPopup = new mapboxgl.Popup({ offset: [0, -30] })
            .setLngLat(feature.geometry.coordinates)
            .setHTML(
                `<a class="map-link" style="color: #fff; text-decoration: none;" href="${feature.properties.link}">
                    <img class="map-image" src="${feature.properties.image}" style="width: 120%; height: auto; margin-top: -10px; margin-right: -20px; margin-left: -20px;">
                    <h2 style="margin-top: 20px; margin-bottom: 0; color: #fff">${feature.properties.title}</h2>
                    <p style="margin-top: 5px; margin-bottom: 5px; color: #fff; font-size: 16px; line-height: 1.1rem;">${feature.properties.description}</p>
                    <a class="map-link" style="color: #fff;" href="${feature.properties.link}">More info</a>
                </a>`
            )
            .addTo(map);
    } else {
        // Mobile version (window width <= 600px)
        currentOverlay = document.createElement('div');
        currentOverlay.className = 'mobile-overlay';
        currentOverlay.style.position = 'fixed';
        currentOverlay.style.bottom = '5vw';
        currentOverlay.style.left = '0';
        currentOverlay.style.width = '90%';
        currentOverlay.style.height = 'auto';
        currentOverlay.style.marginLeft = '5vw';
        currentOverlay.style.borderRadius = '16px';
        currentOverlay.style.backgroundColor = 'rgba(0, 0, 0, 1)';
        currentOverlay.style.zIndex = '1000';
        currentOverlay.style.color = '#fff';
        currentOverlay.style.display = 'flex';
        currentOverlay.style.flexDirection = 'column';
        currentOverlay.style.alignItems = 'left';
        currentOverlay.style.justifyContent = 'left';
        currentOverlay.innerHTML = `
            <div style="position: relative; text-align: left; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);">
                <a class="map-link" style="color: #fff; text-decoration: none;" href="${feature.properties.link}">
                    <img class="map-image" src="${feature.properties.image}" style="width: 100%; height: auto; border-radius: 16px;">
                    <div id="overlay-text" style="width: 88.5%; padding: 20px; position: absolute; bottom: 0; 
                            background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 40%,rgba(0, 0, 0, 0.7) 100%); border-radius: 0 0 16px 16px;">
                        <h2 style="margin-bottom: 5px; color: #fff; font-size: 20px;">${feature.properties.title}</h2>
                        <p style="color: #fff; font-size: 16px; line-height: 1.1rem; margin-bottom: 0;">${feature.properties.description}</p>
                    </div>
                </a>
            </div>
            <button id="close-overlay" style="position: absolute; top: 10px; right: 10px; height: 2rem; width: 2rem; padding: 0; background-color: #fff; color: #000; border: none; border-radius: 6px; font-size: 20px;">⤫</button>
        `;

        document.body.appendChild(currentOverlay);

        // Add class to element when overlay is added if window width is 600px or less
        if (window.innerWidth <= 600) {
            document.getElementById('panel').classList.add('active');
        }

        // Close the overlay when the close button is clicked
        document.getElementById('close-overlay').addEventListener('click', () => {
            document.body.removeChild(currentOverlay);
            currentOverlay = null;
            document.getElementById('panel').classList.remove('active');
        });
    }
});





//-----------------------------------------------------------