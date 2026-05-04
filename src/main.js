// Data de Alumnos - Taller de IA Austral Q1 2026
const studentData = {
    "14-16": [
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
        { name: "Nicolas Martin Torres", email: "nmtorres@mail.austral.edu.ar" }
    ],
    "16-18": [
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
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('delivery-form');
    const comisionSelect = document.getElementById('comision');
    const integrantesContainer = document.getElementById('integrantes-container');
    const addIntegranteBtn = document.getElementById('add-integrante');
    const linksContainer = document.getElementById('links-container');
    const addLinkBtn = document.getElementById('add-link');
    const adminTrigger = document.getElementById('admin-trigger');

    let integranteCount = 0;

    // Función para crear un selector de alumno
    function createIntegranteSelector() {
        if (integranteCount >= 5) return;
        integranteCount++;

        const div = document.createElement('div');
        div.className = 'integrante-row';
        div.style = 'display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem;';
        
        const currentComision = comisionSelect.value;
        let options = '<option value="">Seleccionar alumno...</option>';
        
        if (currentComision && studentData[currentComision]) {
            studentData[currentComision].forEach(s => {
                options += `<option value="${s.name}" data-email="${s.email}">${s.name}</option>`;
            });
        }

        div.innerHTML = `
            <div>
                <label>Integrante ${integranteCount}</label>
                <select class="alumno-select" required>${options}</select>
            </div>
            <div>
                <label>Email</label>
                <input type="email" class="alumno-email" readonly placeholder="Auto-completado">
            </div>
        `;

        integrantesContainer.appendChild(div);

        // Auto-complete email logic
        const select = div.querySelector('.alumno-select');
        const emailInput = div.querySelector('.alumno-email');
        select.addEventListener('change', () => {
            const selected = select.options[select.selectedIndex];
            emailInput.value = selected.dataset.email || '';
        });
    }

    // Inicializar con un integrante
    createIntegranteSelector();

    // Agregar integrantes
    addIntegranteBtn.addEventListener('click', createIntegranteSelector);

    // Manejar cambio de comisión (resetear integrantes)
    comisionSelect.addEventListener('change', () => {
        integrantesContainer.innerHTML = '';
        integranteCount = 0;
        createIntegranteSelector();
    });

    // Agregar Links
    addLinkBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'url';
        input.name = 'project-link';
        input.placeholder = 'https://...';
        input.style = 'margin-bottom: 0.5rem;';
        linksContainer.appendChild(input);
    });

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.innerHTML = 'Enviando proyecto...';
        btn.disabled = true;

        const integrantes = Array.from(document.querySelectorAll('.integrante-row')).map(row => ({
            nombre: row.querySelector('.alumno-select').value,
            email: row.querySelector('.alumno-email').value
        })).filter(i => i.nombre);

        const links = Array.from(document.querySelectorAll('input[name="project-link"]')).map(i => i.value).filter(v => v);

        const payload = {
            comision: comisionSelect.value,
            empresa: document.getElementById('empresa').value,
            integrantes: integrantes,
            links: links,
            comments: document.getElementById('comentarios').value,
            timestamp: new Date().toISOString()
        };

        console.log('Payload Final:', payload);

        setTimeout(() => {
            alert('¡Entrega grupal recibida! Éxitos en la presentación final.');
            form.reset();
            integrantesContainer.innerHTML = '';
            integranteCount = 0;
            createIntegranteSelector();
            btn.innerHTML = 'Enviar Entrega Grupal';
            btn.disabled = false;
        }, 1500);
    });

    // Admin Access
    adminTrigger.addEventListener('click', () => {
        const pass = prompt('Admin Pass:');
        if (pass === 'hike2026') alert('Panel Admin en desarrollo - Los datos se están enviando a la consola.');
    });
});
