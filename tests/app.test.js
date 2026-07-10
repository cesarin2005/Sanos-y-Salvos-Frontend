const { loadApp } = require('./loadApp');

let app;

/**
 * Pruebas de integración del frontend de Sanos y Salvos.
 *
 * A diferencia de un test unitario con mocks, aquí se carga el index.html
 * real y se ejecuta el app.js real sobre un DOM (jsdom) real. Solo se
 * mockean las fronteras externas al sistema (fetch, lucide, google maps),
 * nunca la lógica propia del proyecto.
 */
describe('Sanos y Salvos - Frontend (integración)', () => {

  beforeEach(async () => {
    app = loadApp();
    await app.init();
  });

  describe('Carga inicial (init)', () => {
    test('debe mostrar por defecto las mascotas perdidas activas (Max y Luna, no Rocky que está FOUND)', () => {
      const html = document.getElementById('cards-container').innerHTML;
      expect(html).toContain('Max');
      expect(html).toContain('Luna');
      expect(html).not.toContain('Rocky');
    });

    test('debe calcular correctamente los contadores', () => {
      expect(document.getElementById('count-lost').textContent).toBe('2');
      expect(document.getElementById('count-found').textContent).toBe('2');
      expect(document.getElementById('count-reunited').textContent).toBe('1');
    });

    test('debe poblar el filtro de razas con perros y gatos', () => {
      const html = document.getElementById('filter-breed').innerHTML;
      expect(html).toContain('Labrador Retriever');
      expect(html).toContain('Siamés');
    });

    test('debe poblar el selector de colores de publicación', () => {
      const html = document.getElementById('pub-color').innerHTML;
      expect(html).toContain('Negro');
      expect(html).toContain('Blanco y negro');
    });
  });

  describe('filterCards - búsqueda por texto', () => {
    test('debe filtrar por nombre de mascota', () => {
      document.getElementById('search-input').value = 'luna';
      app.filterCards();
      const html = document.getElementById('cards-container').innerHTML;
      expect(html).toContain('Luna');
      expect(html).not.toContain('Max');
    });

    test('debe filtrar por ubicación', () => {
      document.getElementById('search-input').value = 'providencia';
      app.filterCards();
      const html = document.getElementById('cards-container').innerHTML;
      expect(html).toContain('Max');
      expect(html).not.toContain('Luna');
    });

    test('debe mostrar estado vacío si no hay coincidencias', () => {
      document.getElementById('search-input').value = 'mascota-que-no-existe-xyz';
      app.filterCards();
      const html = document.getElementById('cards-container').innerHTML;
      expect(html).toContain('No se encontraron mascotas');
    });
  });

  describe('filterCards - filtros por atributo', () => {
    test('debe filtrar por especie', () => {
      document.getElementById('filter-species').value = 'Gato';
      app.filterCards();
      const html = document.getElementById('cards-container').innerHTML;
      expect(html).toContain('Luna');
      expect(html).not.toContain('Max');
    });

    test('debe filtrar por género', () => {
      document.getElementById('filter-gender').value = 'Hembra';
      app.filterCards();
      const html = document.getElementById('cards-container').innerHTML;
      expect(html).toContain('Luna');
      expect(html).not.toContain('Max');
    });

    test('debe combinar múltiples filtros (especie + género)', () => {
      document.getElementById('filter-species').value = 'Perro';
      document.getElementById('filter-gender').value = 'Macho';
      app.filterCards();
      const html = document.getElementById('cards-container').innerHTML;
      expect(html).toContain('Max');
      expect(html).not.toContain('Luna');
    });
  });

  describe('showSection - navegación entre pestañas', () => {
    test('sección "found" debe mostrar mascotas encontradas activas', () => {
      app.showSection('found');
      const html = document.getElementById('cards-container').innerHTML;
      expect(html).toContain('badge-status-found');
      expect(html).toContain('Maipú, Santiago');
    });

    test('sección "reunited" debe mostrar solo mascotas con estado FOUND', () => {
      app.showSection('reunited');
      const html = document.getElementById('cards-container').innerHTML;
      expect(html).toContain('Rocky');
      expect(html).not.toContain('Max');
    });

    test('debe marcar como activa la pestaña seleccionada', () => {
      app.showSection('found');
      expect(document.getElementById('tab-found').classList.contains('active')).toBe(true);
      expect(document.getElementById('tab-lost').classList.contains('active')).toBe(false);
    });
  });

  describe('Filtro por comuna (selectComuna / renderComunaList)', () => {
    test('renderComunaList debe filtrar comunas por texto de búsqueda', () => {
      app.renderComunaList('valpara');
      const html = document.getElementById('comuna-list').innerHTML;
      expect(html).toContain('Valparaíso');
      expect(html).not.toContain('Arica');
    });

    test('selectComuna debe actualizar el texto del botón y filtrar las tarjetas', () => {
      app.selectComuna('Ñuñoa');
      expect(document.getElementById('comuna-btn-text').textContent).toBe('Ñuñoa');
      const html = document.getElementById('cards-container').innerHTML;
      expect(html).toContain('Luna');
      expect(html).not.toContain('Max');
    });

    test('selectComuna con string vacío debe volver a mostrar "Todas las comunas"', () => {
      app.selectComuna('Ñuñoa');
      app.selectComuna('');
      expect(document.getElementById('comuna-btn-text').textContent).toBe('Todas las comunas');
    });
  });

  describe('updateBreedsBySpecies', () => {
    test('debe mostrar solo razas de perro cuando se selecciona "Perro"', () => {
      app.updateBreedsBySpecies('Perro');
      const html = document.getElementById('filter-breed').innerHTML;
      expect(html).toContain('Labrador Retriever');
      expect(html).not.toContain('Siamés');
    });

    test('debe mostrar solo razas de gato cuando se selecciona "Gato"', () => {
      app.updateBreedsBySpecies('Gato');
      const html = document.getElementById('filter-breed').innerHTML;
      expect(html).toContain('Siamés');
      expect(html).not.toContain('Labrador Retriever');
    });

    test('debe mostrar todas las razas cuando no hay especie seleccionada', () => {
      app.updateBreedsBySpecies('');
      const html = document.getElementById('filter-breed').innerHTML;
      expect(html).toContain('Labrador Retriever');
      expect(html).toContain('Siamés');
    });
  });

  describe('showMsg', () => {
    test('debe mostrar el mensaje y aplicar la clase de tipo correspondiente', () => {
      app.showMsg('claim-msg', 'Reclamo enviado con éxito', 'success');
      const el = document.getElementById('claim-msg');
      expect(el.textContent).toBe('Reclamo enviado con éxito');
      expect(el.className).toContain('success');
    });

    test('debe reflejar mensajes de error', () => {
      app.showMsg('encounter-msg', 'Ocurrió un error', 'error');
      const el = document.getElementById('encounter-msg');
      expect(el.textContent).toBe('Ocurrió un error');
      expect(el.className).toContain('error');
    });
  });

  describe('openDetail - modal de detalle de mascota', () => {
    test('debe llenar el modal con los datos de una mascota perdida y abrirlo', () => {
      const pet = app.getMockLost()[0]; // Max
      app.openDetail(encodeURIComponent(JSON.stringify(pet)), 'lost');
      expect(document.getElementById('detail-name').textContent).toBe('Max');
      expect(document.getElementById('detail-species').textContent).toBe('Perro');
      expect(document.getElementById('detail-phone').textContent).toBe('+56912345678');
      expect(document.getElementById('modal-detail').classList.contains('open')).toBe(true);
    });

    test('debe mostrar "No disponible" si la mascota no tiene teléfono', () => {
      const pet = { ...app.getMockFound()[0], finderPhone: '' };
      app.openDetail(encodeURIComponent(JSON.stringify(pet)), 'found');
      expect(document.getElementById('detail-phone').textContent).toBe('No disponible');
    });

    test('el botón de acción debe decir "¿Es tu mascota?" para mascotas encontradas', () => {
      const pet = app.getMockFound()[0];
      app.openDetail(encodeURIComponent(JSON.stringify(pet)), 'found');
      expect(document.getElementById('btn-report-encounter').textContent).toBe('¿Es tu mascota?');
    });

    test('el botón de acción debe decir "Reportar encuentro" para mascotas perdidas', () => {
      const pet = app.getMockLost()[0];
      app.openDetail(encodeURIComponent(JSON.stringify(pet)), 'lost');
      expect(document.getElementById('btn-report-encounter').textContent).toBe('Reportar encuentro');
    });
  });

  describe('openClaimModal / submitClaim - reclamar mascota encontrada', () => {
    test('openClaimModal debe llenar los datos y abrir el modal de reclamo', () => {
      const pet = app.getMockFound()[0];
      app.openDetail(encodeURIComponent(JSON.stringify(pet)), 'found');
      app.openClaimModal();
      expect(document.getElementById('claim-finder-phone').textContent).toBe('+56955667788');
      expect(document.getElementById('modal-claim').classList.contains('open')).toBe(true);
    });

    test('submitClaim debe mostrar error si falta el nombre o el teléfono', () => {
      document.getElementById('claim-name').value = '';
      document.getElementById('claim-phone').value = '';
      app.submitClaim();
      const el = document.getElementById('claim-msg');
      expect(el.textContent).toBe('Completa tu nombre y teléfono.');
      expect(el.className).toContain('error');
    });

    test('submitClaim debe mostrar éxito si los campos están completos', () => {
      const pet = app.getMockFound()[0];
      app.openDetail(encodeURIComponent(JSON.stringify(pet)), 'found');
      app.openClaimModal();
      document.getElementById('claim-name').value = 'Camila';
      document.getElementById('claim-phone').value = '+56911111111';
      app.submitClaim();
      const el = document.getElementById('claim-msg');
      expect(el.className).toContain('success');
      expect(el.textContent).toContain('+56955667788');
    });
  });

  describe('openPublish / togglePubFields - modal de publicación', () => {
    test('openPublish debe abrir el modal y resetear el formulario', () => {
      app.openPublish();
      expect(document.getElementById('modal-publish').classList.contains('open')).toBe(true);
      expect(document.getElementById('pub-location').value).toBe('');
    });

    test('togglePubFields debe mostrar los campos de "perdido" cuando el tipo es lost', () => {
      document.getElementById('pub-type').value = 'lost';
      app.togglePubFields();
      expect(document.getElementById('pub-lost-fields').style.display).toBe('block');
      expect(document.getElementById('pub-found-name-fields').style.display).toBe('none');
    });

    test('togglePubFields debe mostrar los campos de "encontrado" cuando el tipo es found', () => {
      document.getElementById('pub-type').value = 'found';
      app.togglePubFields();
      expect(document.getElementById('pub-found-name-fields').style.display).toBe('block');
      expect(document.getElementById('pub-lost-fields').style.display).toBe('none');
    });
  });

  describe('publishPet - validaciones antes de publicar', () => {
    test('debe mostrar error si faltan ubicación, teléfono o nombre de contacto', async () => {
      document.getElementById('pub-type').value = 'lost';
      document.getElementById('pub-location').value = '';
      document.getElementById('pub-phone').value = '';
      document.getElementById('pub-contact-name').value = '';
      const callsBefore = global.fetch.mock.calls.length;
      await app.publishPet();
      const el = document.getElementById('publish-msg');
      expect(el.textContent).toBe('Completa nombre, ubicación y teléfono.');
      expect(el.className).toContain('error');
      // No debe intentar publicar (POST) si la validación falla
      expect(global.fetch.mock.calls.length).toBe(callsBefore);
    });

    test('debe mostrar error si no se ha buscado la ubicación en el mapa', async () => {
      document.getElementById('pub-type').value = 'lost';
      document.getElementById('pub-location').value = 'Providencia';
      document.getElementById('pub-phone').value = '+56911111111';
      document.getElementById('pub-contact-name').value = 'Camila';
      await app.publishPet();
      const el = document.getElementById('publish-msg');
      expect(el.textContent).toBe('Debes buscar la ubicación en el mapa antes de publicar.');
    });
  });
});