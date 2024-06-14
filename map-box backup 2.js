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




// Pin pop-up v1



//Add an event listener that runs when a user clicks on the map element.
// map.on('click', (event) => {
//     const features = map.queryRenderedFeatures(event.point, {
//         layers: ['locations-layer']
//     });
//     if (!features.length) {
//         return;
//     }
//     const feature = features[0];

//     // Create a popup, specify its options and properties, and add it to the map.
//     const popup = new mapboxgl.Popup({ offset: [0, -30] })
//     .setLngLat(feature.geometry.coordinates)
//     .setHTML(
//         `<a class="map-link" style="color: #fff; text-decoration: none;" href="${feature.properties.link}"><img class="map-image" src="${feature.properties.image}" style="width: 120%; height: auto; margin-top: -10px; margin-right: -20px; margin-left: -20px;"><h2 style="margin-top: 20px; margin-bottom: 0; color: #fff">${feature.properties.title}</h2><p style="margin-top: 5px; margin-bottom: 5px; color: #fff; font-size: 16px; line-height: 1.1rem;">${feature.properties.description}</p><a class="map-link" style="color: #fff;" href="${feature.properties.link}">More info</a></a>`
//         )
//     .addTo(map);

//     // Add class to element when popup is added if window width is 600px or less
//     if (window.innerWidth <= 600) {
//         document.getElementById('panel').classList.add('active');
//     }

//     // Remove class from element when popup is closed
//     popup.on('close', () => {
//         document.getElementById('panel').classList.remove('active');
//     });

// });  






//-----------------------------------------------------------




// Pin pop-up v2



// //Add an event listener that runs when a user clicks on the map element.
// map.on('click', (event) => {
//     // desktop version over 600px
//     if (window.innerWidth >= 600) {
//         const features = map.queryRenderedFeatures(event.point, {
//             layers: ['locations-layer']
//         });
//         if (!features.length) {
//             return;
//         }
//         const feature = features[0];

//     // Create a popup, specify its options and properties, and add it to the map.
//         const popup = new mapboxgl.Popup({ offset: [0, -30] })
//         .setLngLat(feature.geometry.coordinates)
//         .setHTML(
//             `<a class="map-link" style="color: #fff; text-decoration: none;" href="${feature.properties.link}"><img class="map-image" src="${feature.properties.image}" style="width: 120%; height: auto; margin-top: -10px; margin-right: -20px; margin-left: -20px;"><h2 style="margin-top: 20px; margin-bottom: 0; color: #fff">${feature.properties.title}</h2><p style="margin-top: 5px; margin-bottom: 5px; color: #fff; font-size: 16px; line-height: 1.1rem;">${feature.properties.description}</p><a class="map-link" style="color: #fff;" href="${feature.properties.link}">More info</a></a>`
//             )
//         .addTo(map);

//     // Add class to element when popup is added if window width is 600px or less
//         if (window.innerWidth <= 600) {
//             document.getElementById('panel').classList.add('active');
//         }

//     // Remove class from element when popup is closed
//         popup.on('close', () => {
//             document.getElementById('panel').classList.remove('active');
//         });

//     } else {

//     }
// }); 

 


//-----------------------------------------------------------
 

 // v3


// // Add an event listener that runs when a user clicks on the map element.
// map.on('click', (event) => {
//     const features = map.queryRenderedFeatures(event.point, {
//         layers: ['locations-layer']
//     });
//     if (!features.length) {
//         return;
//     }
//     const feature = features[0];

//     // Desktop version (window width >= 601px)
//     if (window.innerWidth >= 601) {
//         const popup = new mapboxgl.Popup({ offset: [0, -30] })
//             .setLngLat(feature.geometry.coordinates)
//             .setHTML(
//                 `<a class="map-link" style="color: #fff; text-decoration: none;" href="${feature.properties.link}">
//                     <img class="map-image" src="${feature.properties.image}" style="width: 120%; height: auto; margin-top: -10px; margin-right: -20px; margin-left: -20px;">
//                     <h2 style="margin-top: 20px; margin-bottom: 0; color: #fff">${feature.properties.title}</h2>
//                     <p style="margin-top: 5px; margin-bottom: 5px; color: #fff; font-size: 16px; line-height: 1.1rem;">${feature.properties.description}</p>
//                     <a class="map-link" style="color: #fff;" href="${feature.properties.link}">More info</a>
//                 </a>`
//             )
//             .addTo(map);

//     } else {
//         // Mobile version (window width <= 600px)

//         const overlay = document.createElement('div');
//         overlay.class = 'mobile-overlay';
//         overlay.style.position = 'fixed';
//         overlay.style.bottom = '5vw';
//         overlay.style.left = '0';
//         overlay.style.width = '90%';
//         overlay.style.height = 'auto';
//         overlay.style.marginLeft = '5vw';
//         overlay.style.borderRadius = '16px';
//         overlay.style.paddingBottom = '20px';
//         overlay.style.backgroundColor = 'rgba(0, 0, 0, 1)';
//         overlay.style.zIndex = '1000';
//         overlay.style.color = '#fff';
//         overlay.style.display = 'flex';
//         overlay.style.flexDirection = 'column';
//         overlay.style.alignItems = 'left';
//         overlay.style.justifyContent = 'left';
//         overlay.innerHTML = `
//             <div style="text-align: left;">
//                 <a class="map-link" style="color: #fff; text-decoration: none;" href="${feature.properties.link}">
//                     <img class="map-image" src="${feature.properties.image}" style="width: 100%; height: auto; margin-bottom: 20px; border-radius: 16px 16px 0 0;">
//                     <h2 style="padding-left: 20px; padding-right: 20px; margin-top: 16px; margin-bottom: 5px; color: #fff; font-size: 20px;">${feature.properties.title}</h2>
//                     <p style="padding-left: 20px; padding-right: 20px; margin-top: 5px; margin-bottom: 10px; color: #fff; font-size: 16px; line-height: 1.1rem;">${feature.properties.description}</p>
//                     <a class="map-link" style="margin-left: 20px; color: #fff;" href="${feature.properties.link}">More info</a>
//                 </a>
//             </div>
//             <button id="close-overlay" style="position: relative; top: 10px; right: 10px; margin-top: 20px; padding: 10px 20px; background-color: #fff; color: #000; border: none; border-radius: 5px;">X</button>
//         `;

//         document.body.appendChild(overlay);

        

//         // Add class to element when popup is added if window width is 600px or less
//         if (window.innerWidth <= 600) {
//             document.getElementById('panel').classList.add('active');
//         }

//         // Close the overlay when the close button is clicked and show id='panel' again 
//         document.getElementById('close-overlay').addEventListener('click', () => {
//             document.body.removeChild(overlay);
//             document.getElementById('panel').classList.remove('active');
//         });


//     }
// });




//-----------------------------------------------------------


// v4




let currentPopup = null;
let currentOverlay = null;

// Add an event listener that runs when a user clicks on the map element.
map.on('click', (event) => {
    const features = map.queryRenderedFeatures(event.point, {
        layers: ['locations-layer']
    });
    if (!features.length) {
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
        currentOverlay.style.paddingBottom = '20px';
        currentOverlay.style.backgroundColor = 'rgba(0, 0, 0, 1)';
        currentOverlay.style.zIndex = '1000';
        currentOverlay.style.color = '#fff';
        currentOverlay.style.display = 'flex';
        currentOverlay.style.flexDirection = 'column';
        currentOverlay.style.alignItems = 'left';
        currentOverlay.style.justifyContent = 'left';
        currentOverlay.innerHTML = `
            <div style="text-align: left;">
                <a class="map-link" style="color: #fff; text-decoration: none;" href="${feature.properties.link}">
                    <img class="map-image" src="${feature.properties.image}" style="width: 100%; height: auto; margin-bottom: 20px; border-radius: 16px 16px 0 0;">
                    <h2 style="padding-left: 20px; padding-right: 20px; margin-top: 16px; margin-bottom: 5px; color: #fff; font-size: 20px;">${feature.properties.title}</h2>
                    <p style="padding-left: 20px; padding-right: 20px; margin-top: 5px; margin-bottom: 10px; color: #fff; font-size: 16px; line-height: 1.1rem;">${feature.properties.description}</p>
                    <a class="map-link" style="margin-left: 20px; color: #fff;" href="${feature.properties.link}">More info</a>
                </a>
            </div>
            <button id="close-overlay" style="position: relative; top: 10px; right: 10px; margin-top: 20px; padding: 10px 20px; background-color: #fff; color: #000; border: none; border-radius: 5px;">X</button>
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