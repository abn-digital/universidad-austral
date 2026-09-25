# 🎓 Portal Austral — Taller de IA & Storytelling

**URL en producción:** [https://universidad-austral.web.app](https://universidad-austral.web.app)

Portal académico para el taller de IA de la Universidad Austral (Ingeniería). Los alumnos lo usan para ver la consigna y las herramientas, dar el presente y entregar su proyecto final. Los docentes siguen asistencia, entregas y notas desde el panel `/admin.html`.

---

## 🛠️ Stack Técnico

- **Vite** + Vanilla JS + CSS (sin frameworks)
- **Firebase** (proyecto `hike-agentic-playground`): Hosting (site `universidad-austral`), Firestore, Storage y Auth anónima
- **Google Apps Script**: recibe una copia de cada entrega y asistencia (backup en Google Sheets, POST `no-cors`)
- **Diseño "Hike"**: Inter font, fondo `#FCF9F7`, bordes suaves, dark sections con bordes redondeados

## 📂 Estructura

```
index.html          Portal de alumnos: consigna, herramientas, calendario, entrega, asistencia, FAQ
admin.html          Panel docente (tiene sus estilos inline)
src/
├── cohort.js       Config del cuatrimestre: alumnos, comisiones, clases, deadline, Apps Script
├── main.js         Lógica del portal (entrega, edición por código, asistencia, mini-dashboard)
├── admin.js        Lógica del panel docente
├── firebase.js     Inicialización del SDK
├── html.js         Helpers para escapar datos cargados por alumnos antes de mostrarlos
└── index.css       Estilos del portal
firestore.rules     Reglas de Firestore (se deployan a mano, ver "Deploy")
```

## 🗄️ Datos (Firestore)

| Colección | Campos | Quién escribe |
|---|---|---|
| `attendance` | `nombre`, `clase`, `comision`, `cohorte`, `timestamp` | Portal (dar presente) |
| `submissions` | `comision`, `empresa`, `integrantes`, `links`, `comments`, `editCode`, `searchCode`, `adjuntos`, `cohorte`, `timestamp`, `updatedAt`, `grade` | Portal (entregar/editar) y admin (nota del proyecto) |
| `studentNotes/{id}` | `name`, `grade`, `comments` | Admin |

- Los adjuntos se suben a Storage en `submissions/{empresa}/...`.
- `timestamp` es la hora de la entrega original (define si fue a tiempo). Si el grupo la edita después, queda registrado en `updatedAt`.
- Los registros sin `cohorte` son del cuatrimestre `2026-Q1` (anteriores a que existiera el campo).

## 🚀 Desarrollo Local

```bash
npm install
npm run dev         # Dev server en localhost:5173 (usa la MISMA base de datos que producción)
npm run build       # Build de producción
```

## 🚢 Deploy

Pushear a `main` → GitHub Actions hace el build y deploya **solo Hosting**.

Las reglas de Firestore **no** se deployan solas. Si cambiás `firestore.rules`:

```bash
firebase deploy --only firestore:rules --project hike-agentic-playground
```

## 🔐 Panel Docente (`/admin.html`)

- **Acceso:** botón "ADMIN" en el footer del portal, o directo en `/admin.html`. La contraseña está en `PASS`, en `src/admin.js`.
- **Asistencia:** presentes/ausentes por clase y comisión. Exporta CSV con todas las clases.
- **Entregas:** proyectos por comisión, con el código de edición de cada grupo (🔑, por si alguno lo olvida) y la nota del proyecto.
- **Detalle por alumno:** asistencia, entrega, nota individual y comentarios. Exporta CSV de notas.
- **Nota final** = la mayor entre la nota individual y la mejor nota de proyecto del alumno.

---

## 🔄 Sumar un cuatrimestre nuevo

1. **Guardar lo anterior:** exportar desde el admin los CSV de asistencia y de notas, y marcar el código actual (`git tag q1-2026`, o el que corresponda).
2. **`src/cohort.js`** — todo lo que usan el portal y el admin:
   - `COHORT_ID`: el cuatrimestre nuevo, p. ej. `'2026-Q2'`. **No cambiar** `LEGACY_COHORT_ID`.
   - `COMISIONES`: `key`, `label` (selects del portal), `shortLabel` (filtros del admin) y `students` (`name` + `email`).
   - `CLASSES`: `key`, `label` (admin) y `formLabel` (select de asistencia).
   - `DEADLINE` (mientras no haya fecha, dejalo en `null`: el portal la muestra "a definir") y, si hay planilla nueva, `APPS_SCRIPT_URL`.
3. **`index.html`** — contenido de texto:
   - "Taller de IA — Ingeniería Q1 2026" (hero) y "Austral · Q1 2026" (modal de WhatsApp).
   - Label del countdown ("26 Mayo · 14:00 hs").
   - Calendario: fecha, aula, descripción y links de Meet de cada clase.
   - Fechas límite (entrega, fuera de término, recuperatorio) y fechas de final.
   - Respuesta del FAQ sobre la fecha límite.
   - Link del grupo de WhatsApp: el `href` del botón "Unirme al grupo" (el QR se genera desde ese link).
   - Opcional: sumar proyectos destacados a la sección "Inspiración".
4. **Probar local** (`npm run dev`) y pushear a `main`.

Al cambiar `COHORT_ID`, el portal y el admin muestran solo los registros del cuatrimestre nuevo. Los anteriores quedan intactos en Firestore; para verlos, volvé `COHORT_ID` al valor anterior en local. Las notas de los cuatrimestres nuevos se guardan en `studentNotes/{COHORT_ID}__{alumno}`.

---

## ⚠️ Pendientes conocidos

- **Seguridad:** cualquier visitante (con Auth anónima) puede leer y escribir Firestore, incluidas notas y códigos de edición, y la contraseña del admin está en el JS público. La solución es login con Google para docentes y reglas que restrinjan notas y códigos a esas cuentas (requiere habilitar Google Sign-In en la consola de Firebase).
- **Identidad por nombre:** asistencias, entregas y notas se vinculan por el nombre del alumno. Corregir un nombre en `cohort.js` lo desvincula de sus registros previos.
- **Reglas de Storage:** no están versionadas en el repo; revisarlas en la consola de Firebase.
- **Dependencias:** `npm audit` reporta vulnerabilidades en dependencias de Firebase y Vite 5; actualizarlas requiere probar el sitio.

## 📝 Notas de Diseño

- **No usar TailwindCSS** — todo el diseño está en `index.css` con variables CSS
- **Paleta:** `--bg: #FCF9F7`, `--dark: #1A0A2E`, `--accent-dark: #2D1B4E`, `--yellow: #F4EB33`
- **Font:** Inter (importada desde Google Fonts)
- **Animaciones:** Clases `.reveal` con IntersectionObserver para scroll animations
- **Breakpoints:** 1024px (tablet), 768px (mobile), 480px (small mobile)

## 📞 Si algo se rompe

Revisar la consola del browser. Los errores más comunes:
- **CORS con Google Script:** Es normal que el fetch muestre "opaque" en la consola — funciona igual
- **Alumnos no aparecen:** verificar que las `key` de `COMISIONES` en `src/cohort.js` estén bien y que la lista `students` no tenga errores de sintaxis
- **Firebase deploy falla:** Verificar que `FIREBASE_TOKEN` esté configurado en GitHub Secrets
