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

// ─── Toast Notification ───
function showToast(message, duration = 4000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
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
    }, { threshold: 0.1 });

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
            <div class="form-group">
                <label>Integrante ${num}</label>
                <select class="alumno-select" required>${options}</select>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" class="alumno-email" readonly placeholder="Auto-completado">
            </div>
            <button type="button" class="remove-row-btn">&times;</button>
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
            const labels = row.querySelectorAll('label');
            if (labels[0]) labels[0].textContent = `Integrante ${i + 1}`;
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
    addLinkBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'url';
        input.name = 'project-link';
        input.placeholder = 'https://...';
        input.style.marginBottom = '1rem';
        linksContainer.appendChild(input);
    });

    // ─── Form Submission ───
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
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

        // Simulación de envío (Google Script URL opcional)
        const scriptURL = 'https://script.google.com/macros/s/AKfycbydzqBbLDLa6odKwxH0MVlbV00wIcd6foYxmhIPDWYzE_xkxL98Q6OeQYcBg7fMn50O/exec';

        try {
            // Nota: El modo 'no-cors' no permite leer la respuesta, pero evita errores de CORS con Google Scripts
            await fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            showToast('✅ ¡Entrega recibida! Éxitos en el taller.');
            form.reset();
            integrantesContainer.innerHTML = '';
            integranteCount = 0;
            createIntegranteSelector();
        } catch (error) {
            console.error('Error:', error);
            showToast('❌ Error al enviar. Verificá tu conexión.');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });

    // ─── Admin Access ───
    adminTrigger.addEventListener('click', () => {
        const pass = prompt('Admin Pass:');
        if (pass === 'hike2026') {
            showToast('Acceso concedido. Redirigiendo a base de datos...');
            // window.location.href = '...';
        }
    });
});
