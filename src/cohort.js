// ─── Configuración del cuatrimestre ───────────────────────────
// Todo lo que cambia de un cuatrimestre a otro vive acá (más el contenido
// de texto de index.html). Para arrancar uno nuevo, seguí la checklist del
// README: "Sumar un cuatrimestre nuevo".

// Identificador del cuatrimestre actual. Se guarda en cada asistencia y
// entrega nueva, y el portal y el admin solo muestran los registros que lo tienen.
export const COHORT_ID = '2026-Q2';

// Los registros creados antes de que existiera el campo `cohorte` son de este
// cuatrimestre. No cambiar.
export const LEGACY_COHORT_ID = '2026-Q1';

// Fecha límite de la entrega final (countdown y mini-dashboard del alumno).
// Mientras sea null, el portal la muestra como "a definir".
// Formato: new Date('2026-11-17T14:00:00-03:00')
export const DEADLINE = null;

// Google Apps Script que recibe una copia de cada entrega y asistencia.
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbydzqBbLDLa6odKwxH0MVlbV00wIcd6foYxmhIPDWYzE_xkxL98Q6OeQYcBg7fMn50O/exec';

// `label`: filtros y detalle del admin. `formLabel`: select de asistencia del portal.
// Pendiente: sumar la fecha de cada clase (en el Q1 eran p. ej. 'Clase 1 · 5 May' y 'Clase 1 — Mar 5 Mayo').
export const CLASSES = [
    { key: 'clase-1', label: 'Clase 1', formLabel: 'Clase 1' },
    { key: 'clase-2', label: 'Clase 2', formLabel: 'Clase 2' },
    { key: 'clase-3', label: 'Clase 3', formLabel: 'Clase 3' },
];

// `label`: selects del portal. `shortLabel`: filtros del admin.
// `key` es el código de la comisión en el sistema de la universidad (A1 = Comisión 1, A2 = Comisión 2).
// Alumnos: "Detalle de inscripción a cursada" A1 y A2 del sistema de la universidad.
export const COMISIONES = [
    {
        key: 'A1',
        label: 'Comisión 1 — Martes 29/9',
        shortLabel: 'Comisión 1',
        students: [
            { name: "Teodora Alegre", email: "talegre@mail.austral.edu.ar" },
            { name: "Eliseo Antonio Alvarez Brescia", email: "ealvarezbrescia@mail.austral.edu.ar" },
            { name: "Lautaro Barrozo", email: "lbarrozo@mail.austral.edu.ar" },
            { name: "Vicente Benedit", email: "vbenedit@mail.austral.edu.ar" },
            { name: "Joaquin Brunengo D´Elia", email: "jbrunengo@mail.austral.edu.ar" },
            { name: "Sol Cornejo Saravia", email: "scornejosaravia@mail.austral.edu.ar" },
            { name: "Luca Francisco D´Agostino", email: "ldagostino2@mail.austral.edu.ar" },
            { name: "Marcos Dalma", email: "mdalma@mail.austral.edu.ar" },
            { name: "Galo Martín D Elia", email: "gmdelia@mail.austral.edu.ar" },
            { name: "Simon Cruz Donadu", email: "scdonadu@mail.austral.edu.ar" },
            { name: "Thiago Firmenich Rolón", email: "tfirmenich@mail.austral.edu.ar" },
            { name: "María Sol Fritz", email: "msfritz@mail.austral.edu.ar" },
            { name: "Joaquin Simon Lerner", email: "jlerner@mail.austral.edu.ar" },
            { name: "Isabella Mastronardi Belpoliti", email: "imastronardibelpoli@mail.austral.edu.ar" },
            { name: "Luisa Otero Monsegur", email: "loteromonsegur@mail.austral.edu.ar" },
            { name: "Santino Peirano", email: "speirano@mail.austral.edu.ar" },
            { name: "Gonzalo Pelizzari", email: "gpelizzari@mail.austral.edu.ar" },
            { name: "Bautista Perez", email: "bperez@mail.austral.edu.ar" },
            { name: "Agustin Pinto Escalier", email: "apinto1@mail.austral.edu.ar" },
            { name: "Gonzalo Prola", email: "gprola@mail.austral.edu.ar" },
            { name: "Marco Rigiroli", email: "mrigiroli@mail.austral.edu.ar" },
            { name: "Facundo Sanca", email: "fsanca@mail.austral.edu.ar" },
            { name: "Bautista Valles", email: "bvalles@mail.austral.edu.ar" },
            { name: "Nicolas Verschoor", email: "nverschoor@mail.austral.edu.ar" }
        ],
    },
    {
        key: 'A2',
        label: 'Comisión 2 — Martes 6/10',
        shortLabel: 'Comisión 2',
        students: [
            { name: "Cruz Pedro Bosch", email: "cpbosch@mail.austral.edu.ar" },
            { name: "Milagros Cejas", email: "mcejas@mail.austral.edu.ar" },
            { name: "Paulina Cinque", email: "pcinque1@mail.austral.edu.ar" },
            { name: "Camila María de Salas", email: "cmdesalas@mail.austral.edu.ar" },
            { name: "Jeremías Di Martino", email: "jdimartino@mail.austral.edu.ar" },
            { name: "Lucero María Dormal", email: "ldormal@mail.austral.edu.ar" },
            { name: "Camila Gallo Piva", email: "cgallopiva1@mail.austral.edu.ar" },
            { name: "Javier Hermida Llavallol", email: "jhermidallavallol@mail.austral.edu.ar" },
            { name: "Felipe Houriet", email: "fhouriet@mail.austral.edu.ar" },
            { name: "Marcos Pio Juarez Goñi", email: "mpjuarezgoni@mail.austral.edu.ar" },
            { name: "Santiago Joaquin Kelly", email: "jkelly1@mail.austral.edu.ar" },
            { name: "Maximo Lagos Marmol", email: "mlagosmarmol1@mail.austral.edu.ar" },
            { name: "Tomas Andrés Lanusse", email: "tlanusse@mail.austral.edu.ar" },
            { name: "Mateo Luis Laugle", email: "mlaugle@mail.austral.edu.ar" },
            { name: "Beltran Marco", email: "bmarco@mail.austral.edu.ar" },
            { name: "Pilar Medinger", email: "pmedinger@mail.austral.edu.ar" },
            { name: "Mora Miravé", email: "mmirave@mail.austral.edu.ar" },
            { name: "Clara Maria Molina Bertone", email: "cmmolinabertone@mail.austral.edu.ar" },
            { name: "Joaquim Cesar Parisi Radio", email: "jparisi@mail.austral.edu.ar" },
            { name: "María Pelizzari", email: "mpelizzari@mail.austral.edu.ar" },
            { name: "Ines María Rodriguez Abancens", email: "irodriguezabancens@mail.austral.edu.ar" },
            { name: "Lucía Scott", email: "lscott@mail.austral.edu.ar" },
            { name: "Segundo Tellechea", email: "stellechea@mail.austral.edu.ar" },
            { name: "Gonzalo José Uranga", email: "guranga@mail.austral.edu.ar" }
        ],
    },
];

// { A1: [...alumnos], A2: [...alumnos] }
export const studentData = Object.fromEntries(COMISIONES.map(c => [c.key, c.students]));

export function belongsToCohort(record) {
    return (record.cohorte || LEGACY_COHORT_ID) === COHORT_ID;
}
