mapboxgl.accessToken = 'pk.eyJ1IjoibHVrZWNhaXNoc2FkbGVrIiwiYSI6ImNscTVuMnI1cjAxN2kydnM5dXNveGJub24ifQ.KUqrzudfmNeHhF1hHEehJQ'; 
  const map = new mapboxgl.Map({
    container: 'map',
    // Replace YOUR_STYLE_URL with your style URL.
    style: 'mapbox://styles/lukecaishsadlek/clq72rpek003e01pjcvxcfv63', 
    center: [18, 43.5],
    zoom: 6,
  });


  map.loadImage('pin-monuments.png', (error, image) => {
      if (error) throw error;
      map.addImage('custom-icon', image);
  });


  map.once('load', () => {
    map.resize();
    
    // Load GeoJSON data
    map.addSource('features', {
        type: 'geojson',
        data: 'pin-monuments.geojson'  // Path to GeoJSON file
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
  // map.addControl(new mapboxgl.NavigationControl() );


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
    `<img src="${feature.properties.image}" style="width: 109%; height: auto; margin-top: -10px; margin-right: -10px; margin-left: -10px;"><h2 style="margin-top: 10px; margin-bottom: 0; color: #000">${feature.properties.title}</h2><p style="margin-top: 5px; margin-bottom: 5px; color: #000; font-size: 16px; line-height: 1.1rem;">${feature.properties.description}</p><a class="map-link" href="${feature.properties.link}">More info</a>`
    )
    .addTo(map);

  });