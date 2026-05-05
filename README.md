# 🎓 Portal Austral — Taller de IA & Storytelling

**URL en producción:** [https://universidad-austral.web.app](https://universidad-austral.web.app)

Portal académico para el taller de IA de la Universidad Austral (Ingeniería Q1 2026). Los alumnos lo usan para ver la consigna, las herramientas, dar presente y entregar su proyecto final.

---

## 🛠️ Stack Técnico

- **Vite** + Vanilla JS + CSS (sin frameworks)
- **Firebase Hosting** (proyecto: `hike-agentic-playground`, site: `universidad-austral`)
- **Google Apps Script** para recibir entregas y asistencia (POST `no-cors`)
- **Diseño "Hike"**: Inter font, fondo `#FCF9F7`, bordes suaves, dark sections con bordes redondeados
- **Base de Datos**: Firebase Firestore (Migrado ✅)

## 🏁 Estado del Proyecto
- [x] **Punto 1: Migración a Firestore** (Completado ✅)
- [x] **Punto 2: Sincronización Admin en tiempo real** (Completado ✅)
- [ ] **Punto 3: Optimización Pipeline de Entregas** (En progreso)
- [ ] **Punto 4: Exportación CSV y Filtros Admin** (Pendiente)

## 📂 Estructura

```
portal-austral/
├── index.html          # Toda la estructura de la página
├── src/
│   ├── index.css       # Todo el diseño (variables, componentes, responsive)
│   └── main.js         # Lógica: alumnos, formulario, asistencia, admin
├── dist/               # Build de producción (generado por Vite)
├── firebase.json       # Config de Firebase Hosting
└── package.json
```

## 🚀 Desarrollo Local

```bash
npm install
npm run dev         # Dev server en localhost:5173
npm run build       # Build de producción
```

## 🚢 Deploy

```bash
npm run build
firebase deploy --only hosting:universidad-austral --project hike-agentic-playground
```

O simplemente pushear a `main` — GitHub Actions lo deploya automáticamente.

## 🔐 Admin Panel

- **Acceso:** Click en "ADMIN" en el footer → contraseña: `hike2026`
- **Tab Asistencia:** Muestra presente/ausente por clase (1, 2, 3) con timestamp
- **Tab Entregas:** Lista de entregas recibidas con empresa e integrantes

## 📋 Datos de Alumnos

Los datos de alumnos están hardcodeados en `src/main.js` (objeto `studentData`). Hay dos comisiones:
- `14-16`: 25 alumnos
- `16-18`: 18 alumnos

---

## ⚠️ NEXT STEPS (para quien continúe)

### 1. Persistencia de Datos (Firestore)
Se ha migrado la lógica de `localStorage` a **Firebase Firestore**. Esto permite que:
- La asistencia sea visible en tiempo real desde cualquier dispositivo.
- Las entregas de proyectos queden centralizadas en una base de datos única, evitando la pérdida de información si el alumno limpia el caché del navegador.
- El panel de administración se actualice automáticamente (`onSnapshot`) sin necesidad de recargar la página.

**Colecciones en Firestore:**
- `attendance`: Almacena registros de presente (`nombre`, `clase`, `comision`, `timestamp`).
- `submissions`: Almacena las entregas grupales (`empresa`, `integrantes`, `links`, `comments`, `timestamp`).

### 2. Configuración Técnica
El archivo `src/firebase.js` contiene la inicialización del SDK. El proyecto utiliza la configuración de `hike-agentic-playground`.

### 3. Panel de Administración
Acceso: Botón **ADMIN** en el footer.
Password: `hike2026`
- **Vista de Asistencia**: Muestra alumnos presentes vs ausentes por clase.
- **Vista de Entregas**: Listado de proyectos recibidos con integrantes y links.

### 4. Estado del Proyecto
- [x] **Punto 1: Migración a Firestore** (Completado ✅)
- [x] **Punto 2: Sincronización Admin en tiempo real** (Completado ✅ via onSnapshot)
- [ ] **Punto 3: Optimización Pipeline de Entregas** (En progreso - Firestore integrado)
- [ ] **Punto 4: Exportación CSV y Filtros Admin** (Pendiente)

---

## ⚠️ MEJORAS Y MANTENIMIENTO

### 1. 🟡 IMPORTANTE: Validar el Google Apps Script

El endpoint actual para entregas y asistencia:
```
https://script.google.com/macros/s/AKfycbydzqBbLDLa6odKwxH0MVlbV00wIcd6foYxmhIPDWYzE_xkxL98Q6OeQYcBg7fMn50O/exec
```

Verificar en el Google Sheet asociado que:
- Las entregas (`type: undefined` o sin type) llegan correctamente
- La asistencia (`type: "asistencia"`) se registra en una hoja separada
- Si el script no diferencia por `type`, hay que agregar un `if` en el Apps Script

### 2. 🟢 NICE TO HAVE: Mejoras de UX

- **Notificación visual en asistencia:** Después de dar presente, que el botón cambie a "✓ Presente registrado" y se deshabilite
- **Exportar a CSV desde el admin:** Botón para descargar la lista de asistencia/entregas
- **Filtro por comisión en el admin:** Actualmente muestra todos los alumnos juntos
- **Animación del modal:** Agregar transición de entrada (scale + fade)
- **Dark mode toggle:** Los alumnos lo van a usar en clase, puede servir

### 3. 🔵 OPCIONAL: Mejoras de contenido

- Agregar sección de **FAQ** con preguntas frecuentes de cuatrimestres anteriores
- Agregar un **contador regresivo** hasta la fecha de entrega (2 de Junio)
- Permitir que los alumnos **vean su propio estado** (presentes registrados, entrega hecha) con un mini-dashboard personal

---

## 📝 Notas de Diseño

- **No usar TailwindCSS** — todo el diseño está en `index.css` con variables CSS
- **Paleta:** `--bg: #FCF9F7`, `--dark: #1A0A2E`, `--accent-dark: #2D1B4E`, `--yellow: #F4EB33`
- **Font:** Inter (importada desde Google Fonts)
- **Animaciones:** Clases `.reveal` con IntersectionObserver para scroll animations
- **Breakpoints:** 1024px (tablet), 768px (mobile), 480px (small mobile)

## 📞 Contacto

Si algo se rompe, revisar la consola del browser. Los errores más comunes:
- **CORS con Google Script:** Es normal que el fetch muestre "opaque" en la consola — funciona igual
- **Alumnos no aparecen:** Verificar que `comisionSelect.value` matchea con las keys de `studentData`
- **Firebase deploy falla:** Verificar que `FIREBASE_TOKEN` esté configurado en GitHub Secrets
