# Sanos y Salvos — Frontend

Interfaz web de la plataforma **Sanos y Salvos**, que permite a los usuarios registrarse, iniciar sesión y acceder a las funcionalidades de mascotas perdidas y encontradas.

## Tecnologías

- HTML5 / CSS3 / JavaScript (Vanilla)
- Empaquetado con estándar NPM

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) v9 o superior
- Backend corriendo en `http://localhost:8081` (user-service a través del api-gateway en puerto 8080)

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/cesarin2005/Sanos-y-Salvos-Frontend.git
cd Sanos-y-Salvos-Frontend

# Instalar dependencias
npm install
```

## Ejecución en desarrollo

```bash
npm start
```

Abre el navegador en `http://localhost:3000`

## Build para producción

```bash
npm run build
```

## Estructura del proyecto

```
Sanos-y-Salvos-Frontend/
├── src/
│   ├── index.html       # Página principal (login y registro)
│   ├── app.js           # Lógica de autenticación y llamadas a la API
│   └── style.css        # Estilos globales
├── public/
├── package.json
└── README.md
```

## Funcionalidades

| Funcionalidad | Descripción |
|---|---|
| Iniciar sesión | Autenticación con email y contraseña vía JWT |
| Registrarse | Creación de cuenta con nombre, email, contraseña, teléfono y ciudad |
| Tabs dinámicos | Cambio entre formularios sin recarga de página |
| Manejo de errores | Mensajes de éxito/error en pantalla |

## Patrones de diseño utilizados

- **Módulo (Module Pattern):** `app.js` encapsula las funciones `login()`, `register()`, `showTab()` y `showMessage()` como unidades independientes.
- **Observer (simplificado):** Los eventos `onclick` de los botones observan el estado del DOM y reaccionan sin acoplamiento directo.

## Variables de entorno

Por defecto, la URL de la API está definida directamente en `app.js`:

```javascript
const API = 'http://localhost:8081';
```

Para cambiarla, edita esa constante antes de hacer build.

## Pruebas

```bash
npm test
```

## Repositorio

https://github.com/cesarin2005/Sanos-y-Salvos-Frontend
