const API = 'http://localhost:8080';
let currentSection = 'lost';
let allLost = [];
let allFound = [];
let detailMap = null;
let publishMap = null;
let publishMarker = null;
let encounterMap = null;
let encounterMarker = null;
let encounterLat = null;
let encounterLng = null;
let encounterPhotoBase64 = null;
let currentPet = null;
let currentLat = null;
let currentLng = null;
let currentDetailType = null;
let pubLat = null;
let pubLng = null;
let selectedComuna = '';
let photoBase64 = null;

const COMUNAS_POR_REGION = {
  'Arica y Parinacota': ['Arica','Camarones','General Lagos','Putre'],
  'Tarapacá': ['Alto Hospicio','Camiña','Colchane','Huara','Iquique','Pica','Pozo Almonte'],
  'Antofagasta': ['Antofagasta','Calama','María Elena','Mejillones','Ollagüe','San Pedro de Atacama','Sierra Gorda','Taltal','Tocopilla'],
  'Atacama': ['Alto del Carmen','Caldera','Chañaral','Copiapó','Diego de Almagro','Freirina','Huasco','Tierra Amarilla','Vallenar'],
  'Coquimbo': ['Andacollo','Canela','Combarbalá','Coquimbo','Illapel','La Higuera','La Serena','Los Vilos','Monte Patria','Ovalle','Paihuano','Río Hurtado','Salamanca','Vicuña'],
  'Valparaíso': ['Algarrobo','Cabildo','Calera','Calle Larga','Cartagena','Casablanca','El Quisco','El Tabo','Hijuelas','Juan Fernández','La Cruz','La Ligua','Limache','Llaillay','Los Andes','Nogales','Olmué','Papudo','Petorca','Puchuncaví','Putaendo','Quillota','Quilpué','Quintero','San Antonio','San Esteban','San Felipe','Santa María','Santo Domingo','Valparaíso','Villa Alemana','Viña del Mar','Zapallar'],
  'Metropolitana': ['Alhué','Buin','Calera de Tango','Cerrillos','Cerro Navia','Colina','Conchalí','Curacaví','El Bosque','El Monte','Estación Central','Huechuraba','Independencia','Isla de Maipo','La Cisterna','La Florida','La Granja','La Pintana','La Reina','Lampa','Las Condes','Lo Barnechea','Lo Espejo','Lo Prado','Macul','Maipú','María Pinto','Melipilla','Padre Hurtado','Paine','Pedro Aguirre Cerda','Peñaflor','Peñalolén','Pirque','Providencia','Pudahuel','Puente Alto','Quilicura','Quinta Normal','Recoleta','Renca','San Bernardo','San José de Maipo','San Miguel','San Pedro','Santiago','Talagante','Tiltil','Vitacura','Ñuñoa'],
  'OHiggins': ['Chimbarongo','Chépica','Codegua','Coinco','Coltauco','Doñihue','Graneros','La Estrella','Las Cabras','Litueche','Lolol','Machalí','Malloa','Marchihue','Mostazal','Nancagua','Navidad','Olivar','Palmilla','Paredones','Peralillo','Peumo','Pichidegua','Pichilemu','Placilla','Pumanque','Quinta de Tilcoco','Rancagua','Rengo','Requínoa','San Fernando','San Francisco de Mostazal','San Vicente','Santa Cruz'],
  'Maule': ['Cauquenes','Chanco','Colbún','Constitución','Curepto','Curicó','Empedrado','Hualañé','Licantén','Linares','Longaví','Maule','Molina','Parral','Pelarco','Pelluhue','Pencahue','Rauco','Retiro','Río Claro','Romeral','Sagrada Familia','San Clemente','San Javier','San Rafael','Talca','Teno','Vichuquén','Villa Alegre','Yerbas Buenas'],
  'Ñuble': ['Bulnes','Chillán','Chillán Viejo','Cobquecura','Coelemu','Coihueco','El Carmen','Ninhue','Ñiquén','Pemuco','Pinto','Portezuelo','Quillón','Quirihue','Ranquil','San Carlos','San Fabián','San Ignacio','San Nicolás','Treguaco','Yungay'],
  'Biobío': ['Alto Biobío','Antuco','Arauco','Cabrero','Cañete','Chiguayante','Concepción','Contulmo','Coronel','Curanilahue','Florida','Hualpén','Hualqui','Laja','Lebu','Los Álamos','Los Ángeles','Lota','Mulchén','Nacimiento','Negrete','Penco','Quilaco','Quilleco','San Pedro de la Paz','San Rosendo','Santa Bárbara','Talcahuano','Tirúa','Tomé','Tucapel','Yumbel'],
  'Araucanía': ['Angol','Carahue','Cholchol','Collipulli','Cunco','Curarrehue','Ercilla','Freire','Galvarino','Gorbea','Lautaro','Loncoche','Lonquimay','Los Sauces','Lumaco','Melipeuco','Nueva Imperial','Padre Las Casas','Perquenco','Pitrufquén','Pucón','Purén','Renaico','Saavedra','Temuco','Teodoro Schmidt','Toltén','Traiguén','Victoria','Vilcún','Villarrica'],
  'Los Ríos': ['Corral','Futrono','La Unión','Lago Ranco','Lanco','Los Lagos','Máfil','Mariquina','Paillaco','Panguipulli','Río Bueno','Valdivia'],
  'Los Lagos': ['Ancud','Calbuco','Castro','Chaitén','Chloé','Cochamó','Curaco de Vélez','Dalcahue','Fresia','Frutillar','Futaleufú','Hualaihué','Llanquihue','Los Muermos','Maullín','Osorno','Palena','Puerto Montt','Puerto Octay','Puerto Varas','Puqueldón','Purranque','Puyehue','Queilén','Quemchi','Quínchao','Río Negro','San Juan de la Costa','San Pablo'],
  'Aysén': ['Aysén','Chile Chico','Cisnes','Cochrane','Coihaique','Guaitecas','Lago Verde','OHiggins','Río Ibáñez','Tortel'],
  'Magallanes': ['Antártica','Cabo de Hornos','Laguna Blanca','Natales','Punta Arenas','Río Verde','San Gregorio','Timaukel','Torres del Paine']
};

const COMUNAS_CHILE = Object.values(COMUNAS_POR_REGION).flat().sort();

const RAZAS_PERRO = [
  'Quiltro / Mestizo','Desconocida','Labrador Retriever','Golden Retriever',
  'Pastor Alemán','Bulldog Francés','Beagle','Poodle','Chihuahua',
  'Yorkshire Terrier','Shih Tzu','Boxer','Rottweiler','Dóberman',
  'Husky Siberiano','Cocker Spaniel','Border Collie','Schnauzer',
  'Pomerania','Maltés','Dachshund','Pitbull','Gran Danés'
];

const RAZAS_GATO = [
  'Mestizo / Común','Desconocida','Siamés','Persa','Maine Coon',
  'Ragdoll','Bengalí','Angora','Ruso Azul','Scottish Fold',
  'Británico de Pelo Corto'
];

const COLORES = [
  'Negro','Blanco','Café','Amarillo','Gris','Naranja','Tricolor',
  'Blanco y negro','Blanco y café','Blanco y gris','Negro y café',
  'Atigrado','Dorado','Crema','Rojizo','Plateado','Manchado'
];

async function init() {
  allLost = getMockLost();
  allFound = getMockFound();
  updateCounts();
  renderCards(allLost.filter(p => p.status === 'ACTIVE'), 'lost');
  initComunaDropdown();
  populateBreedColorFilters();
  updatePubBreedsBySpecies();
  populatePubColors();
  loadLost();
  loadFound();
}

function populatePubColors() {
  const colorSelect = document.getElementById('pub-color');
  colorSelect.innerHTML = '<option value="">Selecciona un color</option>' +
    COLORES.map(c => `<option value="${c}">${c}</option>`).join('');
}

function populateBreedColorFilters() {
  const breedSelect = document.getElementById('filter-breed');
  const colorSelect = document.getElementById('filter-color');
  breedSelect.innerHTML = `
    <option value="">Todas</option>
    <optgroup label="🐶 Perros">${RAZAS_PERRO.map(b => `<option value="${b}">${b}</option>`).join('')}</optgroup>
    <optgroup label="🐱 Gatos">${RAZAS_GATO.map(b => `<option value="${b}">${b}</option>`).join('')}</optgroup>
  `;
  colorSelect.innerHTML = '<option value="">Todos</option>' + COLORES.map(c => `<option value="${c}">${c}</option>`).join('');
}

function updateBreedsBySpecies(species) {
  const breedSelect = document.getElementById('filter-breed');
  let breeds = [];
  if (species === 'Perro') breeds = RAZAS_PERRO;
  else if (species === 'Gato') breeds = RAZAS_GATO;
  else breeds = [...new Set([...RAZAS_PERRO, ...RAZAS_GATO])];
  breedSelect.innerHTML = '<option value="">Todas</option>' + breeds.map(b => `<option value="${b}">${b}</option>`).join('');
}

function updatePubBreedsBySpecies() {
  const species = document.getElementById('pub-species').value;
  const breeds = species === 'Gato' ? RAZAS_GATO : RAZAS_PERRO;
  const breedSelect = document.getElementById('pub-breed');
  breedSelect.innerHTML = '<option value="">Selecciona una raza</option>' + breeds.map(b => `<option value="${b}">${b}</option>`).join('');
}

function initComunaDropdown() {
  renderComunaList('');
  const input = document.getElementById('comuna-search');
  const dropdown = document.getElementById('comuna-dropdown');
  const btn = document.getElementById('comuna-btn');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
    if (dropdown.classList.contains('open')) input.focus();
  });
  input.addEventListener('input', () => { renderComunaList(input.value); });
  document.addEventListener('click', (e) => {
    if (!document.getElementById('comuna-wrapper').contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });
}

function renderComunaList(query) {
  const list = document.getElementById('comuna-list');
  const q = query.toLowerCase();
  let html = `<li class="comuna-item ${selectedComuna === '' ? 'selected' : ''}" onclick="selectComuna('')">Todas las comunas</li>`;
  if (q) {
    const filtered = COMUNAS_CHILE.filter(c => c.toLowerCase().includes(q));
    html += filtered.map(c => `<li class="comuna-item ${selectedComuna === c ? 'selected' : ''}" onclick="selectComuna('${c}')">${c}</li>`).join('');
  } else {
    for (const [region, comunas] of Object.entries(COMUNAS_POR_REGION)) {
      html += `<li class="comuna-region-header">${region}</li>`;
      html += comunas.map(c => `<li class="comuna-item ${selectedComuna === c ? 'selected' : ''}" onclick="selectComuna('${c}')">${c}</li>`).join('');
    }
  }
  list.innerHTML = html;
}

function selectComuna(comuna) {
  selectedComuna = comuna;
  document.getElementById('comuna-btn-text').textContent = comuna || 'Todas las comunas';
  document.getElementById('comuna-dropdown').classList.remove('open');
  filterCards();
}

function updateCounts() {
  const active = allLost.filter(p => p.status === 'ACTIVE' || !p.status);
  const reunited = allLost.filter(p => p.status === 'FOUND');
  const foundActive = allFound.filter(p => p.status === 'ACTIVE' || !p.status);
  if (document.getElementById('count-lost')) document.getElementById('count-lost').textContent = active.length;
  if (document.getElementById('count-found')) document.getElementById('count-found').textContent = foundActive.length;
  if (document.getElementById('count-reunited')) document.getElementById('count-reunited').textContent = reunited.length;
  if (document.getElementById('stat-reunited')) document.getElementById('stat-reunited').textContent = reunited.length;
}

async function loadLost() {
  try {
    const res = await fetch(`${API}/api/lost-pets`);
    if (res.ok) { allLost = await res.json(); updateCounts(); filterCards(); }
  } catch(e) {}
}

async function loadFound() {
  try {
    const res = await fetch(`${API}/api/found-pets`);
    if (res.ok) { allFound = await res.json(); updateCounts(); filterCards(); }
  } catch(e) {}
}

function getMockLost() {
  return [
    { id:1, name:'Max', species:'Perro', breed:'Labrador Retriever', color:'Amarillo', gender:'Macho', lastSeenLocation:'Providencia, Santiago', ownerPhone:'+56912345678', description:'Collar azul, muy amigable', latitude:-33.4372, longitude:-70.6506, createdAt:'2026-06-10T10:00:00', status:'ACTIVE', lostDate:'2026-06-10', lostTime:'08:00' },
    { id:2, name:'Luna', species:'Gato', breed:'Siamés', color:'Blanco y gris', gender:'Hembra', lastSeenLocation:'Ñuñoa, Santiago', ownerPhone:'+56987654321', description:'Ojos azules, asustadiza', latitude:-33.4569, longitude:-70.5977, createdAt:'2026-06-11T14:30:00', status:'ACTIVE', lostDate:'2026-06-11', lostTime:'14:00' },
    { id:3, name:'Rocky', species:'Perro', breed:'Beagle', color:'Tricolor', gender:'Macho', lastSeenLocation:'Las Condes, Santiago', ownerPhone:'+56911223344', description:'Collar rojo con nombre', latitude:-33.4094, longitude:-70.5667, createdAt:'2026-06-12T09:00:00', status:'FOUND', lostDate:'2026-06-12', lostTime:'09:00' }
  ];
}

function getMockFound() {
  return [
    { id:1, species:'Perro', breed:'Quiltro / Mestizo', color:'Café', gender:'Desconocido', foundLocation:'Maipú, Santiago', finderPhone:'+56955667788', description:'Sin collar, muy tranquilo', latitude:-33.5116, longitude:-70.7616, createdAt:'2026-06-11T16:00:00', status:'ACTIVE', foundDate:'2026-06-11', foundTime:'16:00' },
    { id:2, species:'Gato', breed:'Mestizo / Común', color:'Blanco', gender:'Hembra', foundLocation:'Vitacura, Santiago', finderPhone:'+56933445566', description:'Con collar rosado sin placa', latitude:-33.3917, longitude:-70.5883, createdAt:'2026-06-12T11:00:00', status:'ACTIVE', foundDate:'2026-06-12', foundTime:'11:00' }
  ];
}

function showSection(section) {
  currentSection = section;
  document.getElementById('tab-lost').classList.toggle('active', section === 'lost');
  document.getElementById('tab-found').classList.toggle('active', section === 'found');
  document.getElementById('tab-reunited').classList.toggle('active', section === 'reunited');
  filterCards();
}

function filterCards() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const species = document.getElementById('filter-species').value;
  const breed = document.getElementById('filter-breed').value;
  const color = document.getElementById('filter-color').value;
  const gender = document.getElementById('filter-gender').value;
  let data = [], type = currentSection;
  if (currentSection === 'lost') { data = allLost.filter(p => p.status === 'ACTIVE' || !p.status); }
  else if (currentSection === 'found') { data = allFound.filter(p => p.status === 'ACTIVE' || !p.status); type = 'found'; }
  else if (currentSection === 'reunited') { data = allLost.filter(p => p.status === 'FOUND'); type = 'reunited'; }
  const filtered = data.filter(p => {
    const name = (p.name || p.species || '').toLowerCase();
    const loc = (p.lastSeenLocation || p.foundLocation || '').toLowerCase();
    const pBreed = (p.breed || '').toLowerCase();
    const matchQuery = !query || name.includes(query) || loc.includes(query) || pBreed.includes(query);
    const matchSpecies = !species || p.species === species;
    const matchBreed = !breed || p.breed === breed;
    const matchColor = !color || p.color === color;
    const matchGender = !gender || p.gender === gender;
    const matchComuna = !selectedComuna || loc.includes(selectedComuna.toLowerCase());
    return matchQuery && matchSpecies && matchBreed && matchColor && matchGender && matchComuna;
  });
  renderCards(filtered, type);
}

function renderCards(pets, type) {
  const container = document.getElementById('cards-container');
  if (!pets.length) {
    container.innerHTML = '<div class="empty-state"><p>🐾</p><h3>No se encontraron mascotas</h3></div>';
    lucide.createIcons();
    return;
  }
  container.innerHTML = pets.map(p => {
    const name = type === 'lost' || type === 'reunited' ? p.name : (p.name || p.species);
    const loc = type === 'lost' || type === 'reunited' ? p.lastSeenLocation : p.foundLocation;
    const date = new Date(p.createdAt).toLocaleDateString('es-CL');
    const emoji = p.species === 'Gato' ? '🐱' : '🐶';
    let badgeClass, badgeText;
    if (type === 'lost') { badgeClass = 'badge-status-lost'; badgeText = 'Perdido'; }
    else if (type === 'found') { badgeClass = 'badge-status-found'; badgeText = 'Encontrado'; }
    else { badgeClass = 'badge-status-reunited'; badgeText = 'Reunido'; }
    const petJson = encodeURIComponent(JSON.stringify(p));
    const cardType = type === 'reunited' ? 'lost' : type;
    const imgContent = p.photoBase64
      ? `<img src="${p.photoBase64}" />`
      : `<div class="pet-card-img">${emoji}</div>`;
    let btnText;
    if (type === 'reunited') btnText = 'Ver detalles';
    else if (type === 'found') btnText = '¿Es tu mascota?';
    else btnText = 'Reportar encuentro';
    return `
      <div class="pet-card" onclick="openDetail('${petJson}', '${cardType}')">
        <div class="pet-card-img-wrap">
          ${imgContent}
          <div class="pet-card-badges">
            <span class="badge badge-species">${p.species}</span>
            <span class="badge ${badgeClass}">${badgeText}</span>
          </div>
        </div>
        <div class="pet-card-body">
          <div class="pet-card-name">${name}</div>
          <div class="pet-card-loc"><i data-lucide="map-pin"></i> ${loc || 'Ubicación no especificada'}</div>
          <div class="pet-card-date"><i data-lucide="calendar"></i> ${date}</div>
          <button class="btn-report">${btnText}</button>
        </div>
      </div>
    `;
  }).join('');
  lucide.createIcons();
}

function openDetail(petEncoded, type) {
  const pet = JSON.parse(decodeURIComponent(petEncoded));
  currentPet = pet;
  currentDetailType = type;
  const name = type === 'lost' ? pet.name : (pet.name || pet.species);
  const loc = type === 'lost' ? pet.lastSeenLocation : pet.foundLocation;
  const phone = type === 'lost' ? pet.ownerPhone : pet.finderPhone;
  const date = type === 'lost' ? pet.lostDate : pet.foundDate;
  const time = type === 'lost' ? pet.lostTime : pet.foundTime;
  document.getElementById('detail-name').textContent = name || '-';
  document.getElementById('detail-species').textContent = pet.species || '-';
  document.getElementById('detail-gender').textContent = pet.gender || 'No especificado';
  document.getElementById('detail-breed').textContent = pet.breed || 'No especificada';
  document.getElementById('detail-color').textContent = pet.color || 'No especificado';
  document.getElementById('detail-phone').textContent = phone || 'No disponible';
  document.getElementById('detail-desc').textContent = pet.description || 'Sin descripción';
  document.getElementById('detail-location').textContent = loc || 'No especificada';
  document.getElementById('detail-date').textContent = date || 'No especificada';
  document.getElementById('detail-time').textContent = time || 'No especificada';
  const photoWrap = document.getElementById('detail-photo-wrap');
  const photoImg = document.getElementById('detail-photo');
  if (pet.photoBase64) { photoImg.src = pet.photoBase64; photoWrap.style.display = 'block'; }
  else { photoWrap.style.display = 'none'; }
  const btnEncounter = document.getElementById('btn-report-encounter');
  if (type === 'reunited') {
    btnEncounter.style.display = 'none';
  } else if (type === 'found') {
    btnEncounter.style.display = 'block';
    btnEncounter.textContent = '¿Es tu mascota?';
    btnEncounter.onclick = openClaimModal;
  } else {
    btnEncounter.style.display = 'block';
    btnEncounter.textContent = 'Reportar encuentro';
    btnEncounter.onclick = openReportEncounter;
  }
  document.getElementById('modal-detail').classList.add('open');
  currentLat = pet.latitude; currentLng = pet.longitude;
  setTimeout(() => {
    if (detailMap) { detailMap.remove(); detailMap = null; }
    const mapEl = document.getElementById('detail-map');
    if (pet.latitude && pet.longitude) {
      mapEl.innerHTML = '';
      detailMap = L.map('detail-map').setView([pet.latitude, pet.longitude], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(detailMap);
      L.marker([pet.latitude, pet.longitude]).addTo(detailMap).bindPopup(`<b>${name}</b><br>${loc}`).openPopup();
    } else {
      mapEl.innerHTML = '<div style="height:220px;display:flex;align-items:center;justify-content:center;background:#f0f4f8;border-radius:12px;color:#7A8A99;font-size:14px;">📍 Ubicación en mapa no disponible</div>';
    }
  }, 100);
}

function openGoogleMaps() {
  if (currentLat && currentLng) window.open(`https://www.google.com/maps?q=${currentLat},${currentLng}`, '_blank');
}

function openReportEncounter() {
  if (!currentPet) return;
  const pet = currentPet;
  const name = pet.name || pet.species;
  const loc = pet.lastSeenLocation;
  const ownerPhone = pet.ownerPhone;
  const emoji = pet.species === 'Gato' ? '🐱' : '🐶';
  const imgEl = document.getElementById('enc-pet-img');
  if (pet.photoBase64) {
    imgEl.innerHTML = `<img src="${pet.photoBase64}" alt="${name}" />`;
  } else {
    imgEl.innerHTML = `<span>${emoji}</span>`;
  }
  document.getElementById('enc-pet-name').textContent = name || pet.species;
  document.getElementById('enc-pet-meta').textContent = [pet.species, pet.breed, pet.color].filter(Boolean).join(' · ');
  document.getElementById('enc-pet-loc').textContent = '📍 ' + (loc || 'Ubicación no especificada');
  document.getElementById('enc-owner-phone').textContent = ownerPhone || 'No disponible';
  encounterPhotoBase64 = null;
  encounterLat = null;
  encounterLng = null;
  document.getElementById('enc-location').value = '';
  document.getElementById('enc-date').value = '';
  document.getElementById('enc-time').value = '';
  document.getElementById('enc-contact-name').value = '';
  document.getElementById('enc-phone').value = '';
  document.getElementById('enc-map').style.display = 'none';
  document.getElementById('enc-location-confirm').style.display = 'none';
  document.getElementById('enc-photo-preview').innerHTML = '<i data-lucide="camera"></i><span>Haz click para subir una foto</span>';
  document.getElementById('enc-photo-preview').className = 'photo-preview-empty';
  if (encounterMap) { encounterMap.remove(); encounterMap = null; }
  closeModal('modal-detail');
  document.getElementById('modal-encounter').classList.add('open');
  setTimeout(() => lucide.createIcons(), 100);
}

function openClaimModal() {
  if (!currentPet) return;
  const pet = currentPet;
  const name = pet.name || pet.species;
  const loc = pet.foundLocation;
  const finderPhone = pet.finderPhone;
  const emoji = pet.species === 'Gato' ? '🐱' : '🐶';
  const imgEl = document.getElementById('claim-pet-img');
  if (pet.photoBase64) {
    imgEl.innerHTML = `<img src="${pet.photoBase64}" alt="${name}" />`;
  } else {
    imgEl.innerHTML = `<span>${emoji}</span>`;
  }
  document.getElementById('claim-pet-name').textContent = name;
  document.getElementById('claim-pet-meta').textContent = [pet.species, pet.breed, pet.color].filter(Boolean).join(' · ');
  document.getElementById('claim-pet-loc').textContent = '📍 ' + (loc || 'Ubicación no especificada');
  document.getElementById('claim-finder-phone').textContent = finderPhone || 'No disponible';
  document.getElementById('claim-name').value = '';
  document.getElementById('claim-phone').value = '';
  closeModal('modal-detail');
  document.getElementById('modal-claim').classList.add('open');
}

function submitClaim() {
  const name = document.getElementById('claim-name').value;
  const phone = document.getElementById('claim-phone').value;
  if (!name || !phone) {
    showMsg('claim-msg', 'Completa tu nombre y teléfono.', 'error'); return;
  }
  showMsg('claim-msg', `¡Contacta a quien la encontró al ${document.getElementById('claim-finder-phone').textContent}!`, 'success');
}

function previewEncounterPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    encounterPhotoBase64 = e.target.result;
    const preview = document.getElementById('enc-photo-preview');
    preview.innerHTML = `<img src="${encounterPhotoBase64}" />`;
    preview.className = 'photo-preview-filled';
  };
  reader.readAsDataURL(file);
}

async function searchEncounterLocation() {
  const location = document.getElementById('enc-location').value;
  if (!location) return;
  try {
    const geo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`);
    const geoData = await geo.json();
    if (geoData.length > 0) {
      encounterLat = parseFloat(geoData[0].lat);
      encounterLng = parseFloat(geoData[0].lon);
      document.getElementById('enc-map').style.display = 'block';
      document.getElementById('enc-location-confirm').style.display = 'block';
      document.getElementById('enc-location-confirm').textContent = '📍 ' + geoData[0].display_name;
      setTimeout(() => {
        if (encounterMap) { encounterMap.remove(); encounterMap = null; encounterMarker = null; }
        encounterMap = L.map('enc-map').setView([encounterLat, encounterLng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(encounterMap);
        encounterMarker = L.marker([encounterLat, encounterLng], { draggable: true }).addTo(encounterMap);
        encounterMarker.on('dragend', (e) => { encounterLat = e.target.getLatLng().lat; encounterLng = e.target.getLatLng().lng; });
      }, 100);
    } else {
      showMsg('encounter-msg', 'No se encontró la ubicación.', 'error');
    }
  } catch(e) { showMsg('encounter-msg', 'Error buscando la ubicación.', 'error'); }
}

async function submitEncounter() {
  const contactName = document.getElementById('enc-contact-name').value;
  const phone = document.getElementById('enc-phone').value;
  const location = document.getElementById('enc-location').value;
  if (!contactName || !phone || !location) {
    showMsg('encounter-msg', 'Completa tu nombre, teléfono y dónde la encontraste.', 'error'); return;
  }
  if (!encounterLat || !encounterLng) {
    showMsg('encounter-msg', 'Debes buscar la ubicación en el mapa antes de confirmar.', 'error'); return;
  }
  const body = {
    name: currentPet.name || null,
    species: currentPet.species,
    breed: currentPet.breed,
    color: currentPet.color,
    gender: currentPet.gender,
    description: `Encuentro reportado por ${contactName}`,
    foundLocation: location,
    finderPhone: phone,
    foundByUserId: 1,
    latitude: encounterLat,
    longitude: encounterLng,
    photoBase64: encounterPhotoBase64,
    foundDate: document.getElementById('enc-date').value,
    foundTime: document.getElementById('enc-time').value
  };
  try {
    const res = await fetch(`${API}/api/found-pets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      showMsg('encounter-msg', '¡Encuentro reportado exitosamente!', 'success');
      setTimeout(() => { closeModal('modal-encounter'); loadFound(); }, 1500);
    } else {
      showMsg('encounter-msg', 'Error al reportar el encuentro.', 'error');
    }
  } catch(e) { showMsg('encounter-msg', 'No se pudo conectar.', 'error'); }
}

function openPublish() {
  pubLat = null; pubLng = null; photoBase64 = null;
  document.getElementById('pub-location').value = '';
  document.getElementById('pub-map').style.display = 'none';
  document.getElementById('pub-location-confirm').style.display = 'none';
  document.getElementById('photo-preview').innerHTML = '<i data-lucide="camera"></i><span>Haz click para subir una foto</span>';
  document.getElementById('photo-preview').className = 'photo-preview-empty';
  if (publishMap) { publishMap.remove(); publishMap = null; publishMarker = null; }
  document.getElementById('modal-publish').classList.add('open');
  setTimeout(() => lucide.createIcons(), 100);
}

function togglePubFields() {
  const type = document.getElementById('pub-type').value;
  document.getElementById('pub-lost-fields').style.display = type === 'lost' ? 'block' : 'none';
  document.getElementById('pub-found-name-fields').style.display = type === 'found' ? 'block' : 'none';
  document.getElementById('pub-lost-date-fields').style.display = type === 'lost' ? 'block' : 'none';
  document.getElementById('pub-found-date-fields').style.display = type === 'found' ? 'block' : 'none';
}

function previewPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    photoBase64 = e.target.result;
    const preview = document.getElementById('photo-preview');
    preview.innerHTML = `<img src="${photoBase64}" />`;
    preview.className = 'photo-preview-filled';
  };
  reader.readAsDataURL(file);
}

async function searchLocation() {
  const location = document.getElementById('pub-location').value;
  if (!location) return;
  try {
    const geo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`);
    const geoData = await geo.json();
    if (geoData.length > 0) {
      pubLat = parseFloat(geoData[0].lat);
      pubLng = parseFloat(geoData[0].lon);
      document.getElementById('pub-map').style.display = 'block';
      document.getElementById('pub-location-confirm').style.display = 'block';
      document.getElementById('pub-location-confirm').textContent = '📍 ' + geoData[0].display_name;
      setTimeout(() => {
        if (publishMap) { publishMap.remove(); publishMap = null; publishMarker = null; }
        publishMap = L.map('pub-map').setView([pubLat, pubLng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(publishMap);
        publishMarker = L.marker([pubLat, pubLng], { draggable: true }).addTo(publishMap);
        publishMarker.on('dragend', (e) => { pubLat = e.target.getLatLng().lat; pubLng = e.target.getLatLng().lng; });
      }, 100);
    } else {
      showMsg('publish-msg', 'No se encontró la ubicación, intenta con más detalle.', 'error');
    }
  } catch(e) { showMsg('publish-msg', 'Error buscando la ubicación.', 'error'); }
}

function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function showMsg(id, text, type) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = 'message ' + type;
}

async function publishPet() {
  const type = document.getElementById('pub-type').value;
  const species = document.getElementById('pub-species').value;
  const breed = document.getElementById('pub-breed').value;
  const color = document.getElementById('pub-color').value;
  const gender = document.getElementById('pub-gender').value;
  const location = document.getElementById('pub-location').value;
  const phone = document.getElementById('pub-phone').value;
  const email = document.getElementById('pub-email').value;
  const desc = document.getElementById('pub-desc').value;
  const contactName = document.getElementById('pub-contact-name').value;
  const eventDate = type === 'lost' ? document.getElementById('pub-lost-date').value : document.getElementById('pub-found-date').value;
  const eventTime = type === 'lost' ? document.getElementById('pub-lost-time').value : document.getElementById('pub-found-time').value;
  if (!location || !phone || !contactName) {
    showMsg('publish-msg', 'Completa nombre, ubicación y teléfono.', 'error'); return;
  }
  if (!pubLat || !pubLng) {
    showMsg('publish-msg', 'Debes buscar la ubicación en el mapa antes de publicar.', 'error'); return;
  }
  const body = type === 'lost' ? {
    name: document.getElementById('pub-name').value,
    species, breed, color, gender, description: desc,
    lastSeenLocation: location, ownerPhone: phone, ownerId: 1,
    latitude: pubLat, longitude: pubLng, photoBase64,
    lostDate: eventDate, lostTime: eventTime
  } : {
    name: document.getElementById('pub-found-name').value || null,
    species, breed, color, gender, description: desc,
    foundLocation: location, finderPhone: phone, foundByUserId: 1,
    latitude: pubLat, longitude: pubLng, photoBase64,
    foundDate: eventDate, foundTime: eventTime
  };
  const endpoint = type === 'lost' ? '/api/lost-pets' : '/api/found-pets';
  try {
    const res = await fetch(`${API}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      showMsg('publish-msg', '¡Publicado exitosamente!', 'success');
      setTimeout(() => closeModal('modal-publish'), 1500);
      if (type === 'lost') await loadLost(); else await loadFound();
    } else { showMsg('publish-msg', 'Error al publicar.', 'error'); }
  } catch(e) { showMsg('publish-msg', 'No se pudo conectar.', 'error'); }
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('open');
  });
});

window.onload = function() { init(); };