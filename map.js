/* ==========================================================
   map.js - interactive Leaflet map on contact.html
   Reads each location from the data-* attributes in the page
   and adds a marker with a popup (more than one location, as
   required by the brief). Tiles: OpenStreetMap.
   ========================================================== */
(function () {
  'use strict';

  var mapEl = document.getElementById('map');
  if (!mapEl) { return; }
  if (typeof L === 'undefined') {
    mapEl.textContent = 'The map could not be loaded. Please use the addresses listed above.';
    return;
  }

  var map = L.map('map', { scrollWheelZoom: false }); // avoids trapping page scroll on mobile
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  var bounds = [];
  document.querySelectorAll('#locations [data-lat]').forEach(function (item) {
    var lat = parseFloat(item.getAttribute('data-lat'));
    var lng = parseFloat(item.getAttribute('data-lng'));
    var name = item.getAttribute('data-name');
    if (isNaN(lat) || isNaN(lng)) { return; }

    var popup = document.createElement('div');
    var strong = document.createElement('strong');
    strong.textContent = name;
    popup.appendChild(strong);

    var marker = L.marker([lat, lng], { title: name, alt: name }).addTo(map);
    marker.bindPopup(popup);
    bounds.push([lat, lng]);

    // Make the card clickable: focus the matching marker
    item.addEventListener('click', function () {
      map.setView([lat, lng], 15);
      marker.openPopup();
    });
  });

  if (bounds.length) { map.fitBounds(bounds, { padding: [40, 40] }); }
  else { map.setView([-26.2041, 28.0473], 11); }
})();
