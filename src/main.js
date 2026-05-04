// Data de Alumnos - Taller de IA Austral Q1 2026
const studentData = {
    "14-16": [
        { name: "Valentina Angeleri", email: "vangeleri@mail.austral.edu.ar", phone: "+54-1144442306" },
        { name: "Mateo Beumont", email: "mbeumont@mail.austral.edu.ar", phone: "+54-1127137409" },
        { name: "Francisco Bruzone", email: "fbruzone@mail.austral.edu.ar", phone: "+54-1166077232" },
        { name: "Benjamin Burgo", email: "bburgo@mail.austral.edu.ar", phone: "+54-91128821018" },
        { name: "Mora Cier", email: "mcier@mail.austral.edu.ar", phone: "+54-91159615588" },
        { name: "Pedro Deluchi", email: "pdeluchi@mail.austral.edu.ar", phone: "+54-1140370112" },
        { name: "Camila María de Salas", email: "cmdesalas@mail.austral.edu.ar", phone: "+54-1130682603" },
        { name: "Iñaki Dominguez", email: "idominguez2@mail.austral.edu.ar", phone: "+54-1123212277" },
        { name: "Ignacio Domnanovich", email: "idomnanovich@mail.austral.edu.ar", phone: "+54-1136067361" },
        { name: "Juan Ignacio Fabbro", email: "jfabbro@mail.austral.edu.ar", phone: "+54-011 2396-7224" },
        { name: "Milagros Fernandez", email: "mfernandez27@mail.austral.edu.ar", phone: "+54-91132468721" },
        { name: "Renata Lucía Fernández", email: "rlfernandez@mail.austral.edu.ar", phone: "+54-1158658547" },
        { name: "Ignacio Gomez Galissier", email: "igomezgalissier@mail.austral.edu.ar", phone: "+54-1140499479" },
        { name: "Joaquin Albano Harguindeguy", email: "jaharguindeguy@mail.austral.edu.ar", phone: "+54-1151243132" },
        { name: "Lucas Leonard", email: "lleonard@mail.austral.edu.ar", phone: "+54-1130207693" },
        { name: "Trinidad Leonard", email: "tleonard@mail.austral.edu.ar", phone: "+54-1140469346" },
        { name: "Mateo Josue Leonov", email: "mjleonov@mail.austral.edu.ar", phone: "+54-2304250222" },
        { name: "Santiago Martinez Alvarez", email: "smartinezalvarez@mail.austral.edu.ar", phone: "+54-91130842007" },
        { name: "Lourdes Massuh", email: "lmassuh@mail.austral.edu.ar", phone: "+54-1158261340" },
        { name: "Benjamin Merhar", email: "bmerhar@mail.austral.edu.ar", phone: "+54-91138500550" },
        { name: "Camila Nemes Meier", email: "cmeier@mail.austral.edu.ar", phone: "+54-2994560493" },
        { name: "Augusto Piepenbrink", email: "apiepenbrink@mail.austral.edu.ar", phone: "+54-91125073630" },
        { name: "Josefina Sfilio Glassmann", email: "jsfilioglassmann@mail.austral.edu.ar", phone: "+54-1122412296" },
        { name: "Martina Soto", email: "msoto3@mail.austral.edu.ar", phone: "+54-1138752254" },
        { name: "Nicolas Martin Torres", email: "nmtorres@mail.austral.edu.ar", phone: "+54-1144719012" }
    ],
    "16-18": [
        { name: "Mateo Ignacio Aldazabal", email: "maldazabal@mail.austral.edu.ar", phone: "+54-1150206481" },
        { name: "Bernardino de Aldecoa", email: "bdealdecoa@mail.austral.edu.ar", phone: "+54-91133966630" },
        { name: "Valentin Del Pino", email: "vdelpino@mail.austral.edu.ar", phone: "+54-1140504533" },
        { name: "Guadalupe Fernandez Garcia", email: "gfernandezgarcia@mail.austral.edu.ar", phone: "+54-91141587078" },
        { name: "Facundo Leon García Lorenzi", email: "flgarcialorenzi@mail.austral.edu.ar", phone: "+54-1159269320" },
        { name: "Juan Ignacio Gomez Cruz", email: "jigomezcruz@mail.austral.edu.ar", phone: "+54-91133391998" },
        { name: "Eliseo Juan Laborde", email: "elaborde1@mail.austral.edu.ar", phone: "+54-3583434584" },
        { name: "Juan Cruz López", email: "jclopez@mail.austral.edu.ar", phone: "+54-1159100637" },
        { name: "Trinidad Maydana", email: "tmaydana@mail.austral.edu.ar", phone: "+54-1136959037" },
        { name: "Ignacio Luca Montovio", email: "ilmontovio@mail.austral.edu.ar", phone: "+54-92994195957" },
        { name: "Tiziano Rossignuolo", email: "trossignuolo@mail.austral.edu.ar", phone: "+54-01130499106" },
        { name: "Miguel Agustin Rozas", email: "marozas@mail.austral.edu.ar", phone: "+54-2995171366" },
        { name: "Salvador Sanchez Pujol", email: "ssanchezpujol@mail.austral.edu.ar", phone: "+54-2477347798" },
        { name: "Abril Santeusanio", email: "asanteusanio@mail.austral.edu.ar", phone: "+54-1158912389" },
        { name: "Ana Sixto", email: "asixto@mail.austral.edu.ar", phone: "+54-11 31672222" },
        { name: "Jose Maria Solanet Zimmermann", email: "jmsolanet@mail.austral.edu.ar", phone: "+54-1151116002" },
        { name: "Renata Staffolani", email: "rstaffolani@mail.austral.edu.ar", phone: "+54-11-2744-2503" },
        { name: "Lucila Tomys de Mello", email: "ltomysdemello@mail.austral.edu.ar", phone: "+54-1166511118" }
    ]
};

// ─── Toast Notification ───
function showToast(message, duration = 4000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('delivery-form');
    const comisionSelect = document.getElementById('comision');
    const integrantesContainer = document.getElementById('integrantes-container');
    const addIntegranteBtn = document.getElementById('add-integrante');
    const linksContainer = document.getElementById('links-container');
    const addLinkBtn = document.getElementById('add-link');
    const adminTrigger = document.getElementById('admin-trigger');

    let integranteCount = 0;

    // ─── Scroll Reveal Animations ───
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ─── Integrante Selector ───
    function createIntegranteSelector() {
        if (integranteCount >= 5) {
            showToast('Máximo 5 integrantes por grupo.');
            return;
        }
        integranteCount++;

        const div = document.createElement('div');
        div.className = 'integrante-row';
        
        const currentComision = comisionSelect.value;
        let options = '<option value="">Seleccionar alumno...</option>';
        
        if (currentComision && studentData[currentComision]) {
            studentData[currentComision].forEach(s => {
                options += `<option value="${s.name}" data-email="${s.email}">${s.name}</option>`;
            });
        }

        const num = integranteCount;
        div.innerHTML = `
            <div>
                <label for="alumno-${num}">Integrante ${num}</label>
                <select id="alumno-${num}" class="alumno-select" required>${options}</select>
            </div>
            <div>
                <label for="email-${num}">Email</label>
                <input type="email" id="email-${num}" class="alumno-email" readonly placeholder="Auto-completado">
            </div>
            <button type="button" class="remove-row-btn" aria-label="Eliminar integrante" title="Eliminar">&times;</button>
        `;

        integrantesContainer.appendChild(div);

        // Auto-complete email
        const select = div.querySelector('.alumno-select');
        const emailInput = div.querySelector('.alumno-email');
        select.addEventListener('change', () => {
            const selected = select.options[select.selectedIndex];
            emailInput.value = selected.dataset.email || '';
        });

        // Remove integrante
        div.querySelector('.remove-row-btn').addEventListener('click', () => {
            div.remove();
            integranteCount--;
            updateIntegranteNumbers();
        });
    }

    function updateIntegranteNumbers() {
        const rows = integrantesContainer.querySelectorAll('.integrante-row');
        rows.forEach((row, i) => {
            const label = row.querySelector('label');
            if (label) label.textContent = `Integrante ${i + 1}`;
        });
    }

    // Init with one integrante
    createIntegranteSelector();

    // Add integrantes
    addIntegranteBtn.addEventListener('click', createIntegranteSelector);

    // Handle comision change (reset integrantes)
    comisionSelect.addEventListener('change', () => {
        integrantesContainer.innerHTML = '';
        integranteCount = 0;
        createIntegranteSelector();
    });

    // ─── Add Links ───
    let linkCount = 1;
    addLinkBtn.addEventListener('click', () => {
        linkCount++;
        const input = document.createElement('input');
        input.type = 'url';
        input.name = 'project-link';
        input.id = `project-link-${linkCount}`;
        input.placeholder = 'https://...';
        linksContainer.appendChild(input);
    });

    // ─── Form Submission ───
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Enviando proyecto...';
        btn.disabled = true;
        btn.style.opacity = '0.6';

        const integrantes = Array.from(document.querySelectorAll('.integrante-row')).map(row => ({
            nombre: row.querySelector('.alumno-select').value,
            email: row.querySelector('.alumno-email').value
        })).filter(i => i.nombre);

        const links = Array.from(document.querySelectorAll('input[name="project-link"]')).map(i => i.value).filter(v => v);

        // Validation
        if (integrantes.length === 0) {
            showToast('⚠️ Agregá al menos un integrante al equipo.');
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.opacity = '1';
            return;
        }

        const payload = {
            comision: comisionSelect.value,
            empresa: document.getElementById('empresa').value,
            integrantes: integrantes,
            links: links,
            driveLink: document.getElementById('drive-link').value,
            comments: document.getElementById('comentarios').value,
            timestamp: new Date().toISOString()
        };

        const scriptURL = 'https://script.google.com/macros/s/AKfycbydzqBbLDLa6odKwxH0MVlbV00wIcd6foYxmhIPDWYzE_xkxL98Q6OeQYcBg7fMn50O/exec';

        try {
            await fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            showToast('✅ ¡Entrega grupal recibida! Éxitos en la presentación final.');
            form.reset();
            integrantesContainer.innerHTML = '';
            integranteCount = 0;
            createIntegranteSelector();
        } catch (error) {
            console.error('Error:', error);
            showToast('❌ Hubo un error al enviar. Intentá de nuevo.');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    });

    // ─── Admin Access ───
    adminTrigger.addEventListener('click', () => {
        const pass = prompt('Admin Pass:');
        if (pass === 'hike2026') showToast('Panel Admin en desarrollo — Los datos se envían a la consola.');
    });
});
