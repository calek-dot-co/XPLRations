//-----------------------------------------------------------
// Store the original GeoJSON data
let originalGeoJSONData = null;





//-----------------------------------------------------------
// Map config and settings

mapboxgl.accessToken = 'pk.eyJ1IjoibHVrZWNhaXNoc2FkbGVrIiwiYSI6ImNscTVuMnI1cjAxN2kydnM5dXNveGJub24ifQ.KUqrzudfmNeHhF1hHEehJQ';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/lukecaishsadlek/clq72rpek003e01pjcvxcfv63',
  center: [0, 0], // initial world view center
  zoom: 1 // initial world view zoom
});





//-----------------------------------------------------------

// Custom pin image

map.loadImage('pin-active.png', (error, image) => {
  if (error) throw error;
  map.addImage('pin-active', image);
  console.log('pin-active loaded');
});

map.loadImage('pin-faded.png', (error, image) => {
  if (error) throw error;
  map.addImage('pin-faded', image);
  console.log('pin-faded loaded');
});

map.loadImage('pin-selected.png', (error, image) => {
  if (error) throw error;
  map.addImage('pin-selected', image);
  console.log('pin-selected loaded');
});

// Map controls

var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');





//-----------------------------------------------------------

// On map load, add pins, open/close a pop-up on click, change pin image on filter

map.once('load', () => {
  map.resize();

  // Load GeoJSON data and store it
  fetch('pins.geojson')
    .then(response => response.json())
    .then(data => {
      originalGeoJSONData = data;

      map.addSource('features', {
        type: 'geojson',
        data: originalGeoJSONData
      });

      map.addLayer({
        id: 'locations-layer',
        type: 'symbol',
        source: 'features',
        layout: {
          'icon-image': ['get', 'icon-image'], // Get the icon-image property from feature
          'icon-allow-overlap': true,
          'icon-size': 0.5, // Scale
          'icon-anchor': 'bottom' // Anchor position
        }
      });

      console.log('Pins layer added to map');
    });

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
        .setHTML(`
            <div class="homepage-project-teaser">
                <a class="homepage-project-link" href="${feature.properties.link}">
                    <img class="homepage-project-image" src="${feature.properties.image}">
                    <div class="homepage-project-overlay-text">
                        <h3 class="homepage-l homepage-l-project-teaser">${feature.properties.title}</h3>
                        <p class="homepage-s homepage-s-project-teaser">${feature.properties.location || ''}, ${feature.properties.country || ''}</p>
                    </div>
                </a>
            </div>
        `)
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
        <div class="homepage-project-teaser" style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);">
                    <a class="homepage-project-link" href="${feature.properties.link}">
                        <img class="homepage-project-image" style="width: 90vw; height: auto;" src="${feature.properties.image}">
                        <div class="homepage-project-overlay-text" style="width: 82vw;">
                            <h3 class="homepage-l homepage-l-project-teaser">${feature.properties.title}</h3>
                            <p class="homepage-s homepage-s-project-teaser">${feature.properties.location || ''}, ${feature.properties.country || ''}</p>
                        </div>
                    </a>
                </div>
        <button id="close-overlay" style="position: absolute; top: 0; right: 0; margin: 10px; height: 2.2rem; width: 2.2rem; text-align: center; padding: 0; background-color: rgba(0, 0, 0, 0.5); color: #fff; border: none; border-radius: 20px; font-size: 20px;">✕</button>
      `;
        //<div style="position: relative; text-align: left; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);">
        //   <a class="map-link" style="color: #fff; text-decoration: none;" href="${feature.properties.link}">
        //     <img class="map-image" src="${feature.properties.image}" style="width: 100%; height: auto; border-radius: 16px;">
        //     <div id="overlay-text" style="width: 88.5%; padding: 20px; position: absolute; bottom: 0; 
        //             background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 40%,rgba(0, 0, 0, 0.7) 100%); border-radius: 0 0 16px 16px;">
        //       <h2 style="margin-bottom: 5px; color: #fff; font-size: 20px;">${feature.properties.title}</h2>
        //       <p style="color: #fff; font-size: 16px; line-height: 1.1rem; margin-bottom: 0;">${feature.properties.location || ''}, ${feature.properties.country || ''}</p>
        //     </div>
        //   </a>
        //</div>

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

// Pin image update on filter
document.getElementById('country-filter').addEventListener('change', event => {
  const selectedOption = event.target.options[event.target.selectedIndex];
  const selectedCountry = selectedOption.getAttribute('data-filter');
  console.log('Selected country:', selectedCountry);

  // Update the icon-image property based on the selected country
  originalGeoJSONData.features.forEach(feature => {
    if (selectedCountry === 'all') {
      feature.properties['icon-image'] = 'pin-active';
    } else if (feature.properties.country.toLowerCase() === selectedCountry.toLowerCase()) {
      feature.properties['icon-image'] = 'pin-active';
    } else {
      feature.properties['icon-image'] = 'pin-faded';
    }
  });

  // Update the data source with the new icon-image values
  map.getSource('features').setData(originalGeoJSONData);
});

  
});
