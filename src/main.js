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

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbz_XXXXXXXXX/exec';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('delivery-form');
    const comisionSelect = document.getElementById('comision');
    const alumnoSelect = document.getElementById('nombre'); // Cambiado a select en el HTML
    const emailInput = document.getElementById('email');
    const adminTrigger = document.getElementById('admin-trigger');

    // Manejar cambio de comisión para filtrar alumnos
    comisionSelect.addEventListener('change', (e) => {
        const comision = e.target.value;
        alumnoSelect.innerHTML = '<option value="">Seleccionar alumno...</option>';
        emailInput.value = '';

        if (comision && studentData[comision]) {
            studentData[comision].forEach(student => {
                const opt = document.createElement('option');
                opt.value = student.name;
                opt.textContent = student.name;
                opt.dataset.email = student.email;
                alumnoSelect.appendChild(opt);
            });
        }
    });

    // Auto-completar email al seleccionar alumno
    alumnoSelect.addEventListener('change', (e) => {
        const selectedOpt = alumnoSelect.options[alumnoSelect.selectedIndex];
        emailInput.value = selectedOpt.dataset.email || '';
    });

    // Handle Form Submission
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Enviando...';
            btn.disabled = true;

            const data = {
                event: 'finished_case',
                timestamp: new Date().toISOString(),
                comision: comisionSelect.value,
                nombre: alumnoSelect.value,
                email: emailInput.value,
                empresa: document.getElementById('empresa').value,
                url_web: document.getElementById('url-web').value,
                comments: document.getElementById('comentarios').value
            };

            try {
                console.log('Enviando datos:', data);
                // Aquí va el fetch real al webhook
                setTimeout(() => {
                    alert('¡Excelente entrega, ' + data.nombre + '! Ya podés ver tu proyecto online.');
                    form.reset();
                    alumnoSelect.innerHTML = '<option value="">Seleccionar alumno...</option>';
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 1000);
            } catch (error) {
                alert('Error al enviar. Avisá por WhatsApp.');
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    // Admin Access
    adminTrigger.addEventListener('click', () => {
        const password = prompt('Admin Access:');
        if (password === 'hike2026') showAdminPanel();
    });
});

function showAdminPanel() {
    const overlay = document.createElement('div');
    overlay.style = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: var(--bg); z-index: 1000; padding: 4rem 2rem; overflow-y: auto;`;
    overlay.innerHTML = `
        <div class="container">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem;">
                <h2>Admin Panel <span>Austral</span></h2>
                <button id="close-admin" class="btn-primary">Cerrar</button>
            </div>
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 1rem; overflow: hidden; border: 1px solid var(--border);">
                <thead style="background: var(--dark); color: white; text-align: left;">
                    <tr><th style="padding: 1rem;">Alumno</th><th style="padding: 1rem;">Empresa</th><th style="padding: 1rem;">Comisión</th><th style="padding: 1rem;">Link</th></tr>
                </thead>
                <tbody><tr><td colspan="4" style="padding: 3rem; text-align: center;">Cargando entregas...</td></tr></tbody>
            </table>
        </div>`;
    document.body.appendChild(overlay);
    document.getElementById('close-admin').onclick = () => overlay.remove();
}
