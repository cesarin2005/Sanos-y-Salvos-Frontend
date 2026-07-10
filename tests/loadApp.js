const fs = require('fs');
const path = require('path');

function loadApp() {
  const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
  document.open();
  document.write(html);
  document.close();

  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: false, json: () => Promise.resolve([]) })
  );
  global.lucide = { createIcons: jest.fn() };
  global.google = {
    maps: {
      Map: jest.fn(),
      Marker: jest.fn(),
      LatLng: jest.fn(),
    },
  };

  // Mock de Leaflet 
  const leafletChain = {
    setView: jest.fn(function () { return this; }),
    addTo: jest.fn(function () { return this; }),
    bindPopup: jest.fn(function () { return this; }),
    openPopup: jest.fn(function () { return this; }),
    remove: jest.fn(),
    on: jest.fn(),
    getLatLng: jest.fn(() => ({ lat: -33.45, lng: -70.66 })),
  };
  global.L = {
    map: jest.fn(() => leafletChain),
    tileLayer: jest.fn(() => leafletChain),
    marker: jest.fn(() => leafletChain),
  };

  jest.resetModules();
  return require('../app.js');
}

module.exports = { loadApp };