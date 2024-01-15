mapboxgl.accessToken = 'pk.eyJ1IjoibHVrZWNhaXNoc2FkbGVrIiwiYSI6ImNscTVuMnI1cjAxN2kydnM5dXNveGJub24ifQ.KUqrzudfmNeHhF1hHEehJQ'; 

const map = new mapboxgl.Map({
  container: 'map',
  // Replace YOUR_STYLE_URL with your style URL.
  style: 'mapbox://styles/lukecaishsadlek/clq72rpek003e01pjcvxcfv63', 
  center: [19.5, 43.8],
  zoom: 6.5,
});



// Set map zoom based on screen size

var mq = window.matchMedia( "(min-width: 600px)" );

if (mq.matches){
    map.setZoom(6.5); //set map zoom level for desktop size
} else {
    map.setZoom(5); //set map zoom level for mobile size
    map.setCenter([18, 42.8])
};



// Custom pin image

map.loadImage('pins.png', (error, image) => {
    if (error) throw error;
    map.addImage('custom-icon', image);
});



// Map controls

var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');



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


  //Add an event listener that runs when a user clicks on the map element.
  map.on('click', (event) => {
    const features = map.queryRenderedFeatures(event.point, {
    layers: ['locations-layer']
    });
    if (!features.length) {
    return;
    }
    const feature = features[0];

    // Create a popup, specify its options and properties, and add it to the map.
    const popup = new mapboxgl.Popup({ offset: [0, -30] })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(
    `<a class="map-link" style="color: #fff; text-decoration: none;" href="${feature.properties.link}"><img class="map-image" src="${feature.properties.image}" style="width: 120%; height: auto; margin-top: -10px; margin-right: -20px; margin-left: -20px;"><h2 style="margin-top: 20px; margin-bottom: 0; color: #fff">${feature.properties.title}</h2><p style="margin-top: 5px; margin-bottom: 5px; color: #fff; font-size: 16px; line-height: 1.1rem;">${feature.properties.description}</p><a class="map-link" style="color: #fff;" href="${feature.properties.link}">More info</a></a>`
    )
    .addTo(map);

  });