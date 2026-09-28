// Cuatrimestres anteriores que se pueden consultar desde el panel docente.
// Al arrancar un cuatrimestre nuevo, agregá acá (arriba de todo) la configuración
// del que termina, copiando CLASSES y COMISIONES de src/cohort.js. Los emails no
// hacen falta: el panel solo usa los nombres.
export const PAST_COHORTS = [
    {
        id: "2026-Q1",
        CLASSES: [
            { key: "clase-1", label: "Clase 1 · 5 May", formLabel: "Clase 1 — Mar 5 Mayo" },
            { key: "clase-2", label: "Clase 2 · 12 May", formLabel: "Clase 2 — Mar 12 Mayo" },
            { key: "clase-3", label: "Clase 3 · 19 May", formLabel: "Clase 3 — Mar 19 Mayo" }
        ],
        COMISIONES: [
            {
                key: "14-16",
                label: "Martes 14:00 - 16:00",
                shortLabel: "14:00 – 16:00",
                students: [
                    { name: "Valentina Angeleri" },
                    { name: "Mateo Beumont" },
                    { name: "Francisco Bruzone" },
                    { name: "Benjamin Burgo" },
                    { name: "Mora Cier" },
                    { name: "Pedro Deluchi" },
                    { name: "Camila María de Salas" },
                    { name: "Iñaki Dominguez" },
                    { name: "Ignacio Domnanovich" },
                    { name: "Juan Ignacio Fabbro" },
                    { name: "Milagros Fernandez" },
                    { name: "Renata Lucía Fernández" },
                    { name: "Ignacio Gomez Galissier" },
                    { name: "Joaquin Albano Harguindeguy" },
                    { name: "Lucas Leonard" },
                    { name: "Trinidad Leonard" },
                    { name: "Mateo Josue Leonov" },
                    { name: "Santiago Martinez Alvarez" },
                    { name: "Lourdes Massuh" },
                    { name: "Benjamin Merhar" },
                    { name: "Camila Nemes Meier" },
                    { name: "Augusto Piepenbrink" },
                    { name: "Josefina Sfilio Glassmann" },
                    { name: "Martina Soto" },
                    { name: "Nicolas Martin Torres" },
                    { name: "Bauti Ballatore" }
                ],
            },
            {
                key: "16-18",
                label: "Martes 16:00 - 18:00",
                shortLabel: "16:00 – 18:00",
                students: [
                    { name: "Mateo Ignacio Aldazabal" },
                    { name: "Bernardino de Aldecoa" },
                    { name: "Valentin Del Pino" },
                    { name: "Guadalupe Fernandez Garcia" },
                    { name: "Facundo Leon García Lorenzi" },
                    { name: "Juan Ignacio Gomez Cruz" },
                    { name: "Eliseo Juan Laborde" },
                    { name: "Juan Cruz López" },
                    { name: "Trinidad Maydana" },
                    { name: "Ignacio Luca Montovio" },
                    { name: "Tiziano Rossignuolo" },
                    { name: "Miguel Agustin Rozas" },
                    { name: "Salvador Sanchez Pujol" },
                    { name: "Abril Santeusanio" },
                    { name: "Ana Sixto" },
                    { name: "Jose Maria Solanet Zimmermann" },
                    { name: "Renata Staffolani" },
                    { name: "Lucila Tomys de Mello" }
                ],
            }
        ],
    },
];
