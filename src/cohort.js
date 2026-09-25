// ─── Configuración del cuatrimestre ───────────────────────────
// Todo lo que cambia de un cuatrimestre a otro vive acá (más el contenido
// de texto de index.html). Para arrancar uno nuevo, seguí la checklist del
// README: "Sumar un cuatrimestre nuevo".

// Identificador del cuatrimestre actual. Se guarda en cada asistencia y
// entrega nueva, y el portal y el admin solo muestran los registros que lo tienen.
export const COHORT_ID = '2026-Q1';

// Los registros creados antes de que existiera el campo `cohorte` son de este
// cuatrimestre. No cambiar.
export const LEGACY_COHORT_ID = '2026-Q1';

// Fecha límite de la entrega final (countdown y mini-dashboard del alumno).
export const DEADLINE = new Date('2026-05-26T14:00:00-03:00');

// Google Apps Script que recibe una copia de cada entrega y asistencia.
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbydzqBbLDLa6odKwxH0MVlbV00wIcd6foYxmhIPDWYzE_xkxL98Q6OeQYcBg7fMn50O/exec';

// `label`: filtros y detalle del admin. `formLabel`: select de asistencia del portal.
export const CLASSES = [
    { key: 'clase-1', label: 'Clase 1 · 5 May', formLabel: 'Clase 1 — Mar 5 Mayo' },
    { key: 'clase-2', label: 'Clase 2 · 12 May', formLabel: 'Clase 2 — Mar 12 Mayo' },
    { key: 'clase-3', label: 'Clase 3 · 19 May', formLabel: 'Clase 3 — Mar 19 Mayo' },
];

// `label`: selects del portal. `shortLabel`: filtros del admin.
export const COMISIONES = [
    {
        key: '14-16',
        label: 'Martes 14:00 - 16:00',
        shortLabel: '14:00 – 16:00',
        students: [
            { name: "Valentina Angeleri", email: "vangeleri@mail.austral.edu.ar" },
            { name: "Mateo Beumont", email: "mbeumont@mail.austral.edu.ar" },
            { name: "Francisco Bruzone", email: "fbruzone@mail.austral.edu.ar" },
            { name: "Benjamin Burgo", email: "bburgo@mail.austral.edu.ar" },
            { name: "Mora Cier", email: "mcier@mail.austral.edu.ar" },
            { name: "Pedro Deluchi", email: "pdeluchi@mail.austral.edu.ar" },
            { name: "Camila María de Salas", email: "cmdesalas@mail.austral.edu.ar" },
            { name: "Iñaki Dominguez", email: "idominguez2@mail.austral.edu.ar" },
            { name: "Ignacio Domnanovich", email: "idomnanovich@mail.austral.edu.ar" },
            { name: "Juan Ignacio Fabbro", email: "jfabbro@mail.austral.edu.ar" },
            { name: "Milagros Fernandez", email: "mfernandez27@mail.austral.edu.ar" },
            { name: "Renata Lucía Fernández", email: "rlfernandez@mail.austral.edu.ar" },
            { name: "Ignacio Gomez Galissier", email: "igomezgalissier@mail.austral.edu.ar" },
            { name: "Joaquin Albano Harguindeguy", email: "jaharguindeguy@mail.austral.edu.ar" },
            { name: "Lucas Leonard", email: "lleonard@mail.austral.edu.ar" },
            { name: "Trinidad Leonard", email: "tleonard@mail.austral.edu.ar" },
            { name: "Mateo Josue Leonov", email: "mjleonov@mail.austral.edu.ar" },
            { name: "Santiago Martinez Alvarez", email: "smartinezalvarez@mail.austral.edu.ar" },
            { name: "Lourdes Massuh", email: "lmassuh@mail.austral.edu.ar" },
            { name: "Benjamin Merhar", email: "bmerhar@mail.austral.edu.ar" },
            { name: "Camila Nemes Meier", email: "cmeier@mail.austral.edu.ar" },
            { name: "Augusto Piepenbrink", email: "apiepenbrink@mail.austral.edu.ar" },
            { name: "Josefina Sfilio Glassmann", email: "jsfilioglassmann@mail.austral.edu.ar" },
            { name: "Martina Soto", email: "msoto3@mail.austral.edu.ar" },
            { name: "Nicolas Martin Torres", email: "nmtorres@mail.austral.edu.ar" },
            { name: "Bauti Ballatore", email: "bballatore@mail.austral.edu.ar" }
        ],
    },
    {
        key: '16-18',
        label: 'Martes 16:00 - 18:00',
        shortLabel: '16:00 – 18:00',
        students: [
            { name: "Mateo Ignacio Aldazabal", email: "maldazabal@mail.austral.edu.ar" },
            { name: "Bernardino de Aldecoa", email: "bdealdecoa@mail.austral.edu.ar" },
            { name: "Valentin Del Pino", email: "vdelpino@mail.austral.edu.ar" },
            { name: "Guadalupe Fernandez Garcia", email: "gfernandezgarcia@mail.austral.edu.ar" },
            { name: "Facundo Leon García Lorenzi", email: "flgarcialorenzi@mail.austral.edu.ar" },
            { name: "Juan Ignacio Gomez Cruz", email: "jigomezcruz@mail.austral.edu.ar" },
            { name: "Eliseo Juan Laborde", email: "elaborde1@mail.austral.edu.ar" },
            { name: "Juan Cruz López", email: "jclopez@mail.austral.edu.ar" },
            { name: "Trinidad Maydana", email: "tmaydana@mail.austral.edu.ar" },
            { name: "Ignacio Luca Montovio", email: "ilmontovio@mail.austral.edu.ar" },
            { name: "Tiziano Rossignuolo", email: "trossignuolo@mail.austral.edu.ar" },
            { name: "Miguel Agustin Rozas", email: "marozas@mail.austral.edu.ar" },
            { name: "Salvador Sanchez Pujol", email: "ssanchezpujol@mail.austral.edu.ar" },
            { name: "Abril Santeusanio", email: "asanteusanio@mail.austral.edu.ar" },
            { name: "Ana Sixto", email: "asixto@mail.austral.edu.ar" },
            { name: "Jose Maria Solanet Zimmermann", email: "jmsolanet@mail.austral.edu.ar" },
            { name: "Renata Staffolani", email: "rstaffolani@mail.austral.edu.ar" },
            { name: "Lucila Tomys de Mello", email: "ltomysdemello@mail.austral.edu.ar" }
        ],
    },
];

// { '14-16': [...alumnos], '16-18': [...alumnos] }
export const studentData = Object.fromEntries(COMISIONES.map(c => [c.key, c.students]));

export function belongsToCohort(record) {
    return (record.cohorte || LEGACY_COHORT_ID) === COHORT_ID;
}
