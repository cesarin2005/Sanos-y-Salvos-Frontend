const API = 'http://localhost:8081';

function showTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.form-section').forEach(f => f.classList.add('hidden'));
  document.getElementById(tab).classList.remove('hidden');
  event.target.classList.add('active');
  clearMessages();
}

function showMessage(id, text, type) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = 'message ' + type;
}

function clearMessages() {
  document.querySelectorAll('.message').forEach(m => {
    m.textContent = '';
    m.className = 'message';
  });
}

async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showMessage('login-msg', 'Por favor completa todos los campos.', 'error');
    return;
  }

  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      showMessage('login-msg', `Bienvenido ${data.name} 🐾`, 'success');
    } else {
      showMessage('login-msg', data.message || 'Credenciales inválidas.', 'error');
    }
  } catch (err) {
    showMessage('login-msg', 'No se pudo conectar con el servidor.', 'error');
  }
}

async function register() {
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const phone = document.getElementById('reg-phone').value;
  const city = document.getElementById('reg-city').value;

  if (!name || !email || !password || !phone) {
    showMessage('register-msg', 'Por favor completa los campos obligatorios.', 'error');
    return;
  }

  try {
    const res = await fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone, city })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      showMessage('register-msg', `Cuenta creada exitosamente 🐾`, 'success');
    } else {
      showMessage('register-msg', data.message || 'Error al registrar.', 'error');
    }
  } catch (err) {
    showMessage('register-msg', 'No se pudo conectar con el servidor.', 'error');
  }
}