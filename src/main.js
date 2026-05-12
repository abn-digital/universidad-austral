import { auth, db, storage } from './firebase.js';
import { 
    collection, 
    addDoc, 
    onSnapshot, 
    query, 
    orderBy, 
    where, 
    getDocs,
    serverTimestamp 
} from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
        { name: "Nicolas Martin Torres", email: "nmtorres@mail.austral.edu.ar" },
        { name: "Bauti Ballatore", email: "bballatore@mail.austral.edu.ar" }
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
    let currentAttendance = [];
    let currentSubmissions = [];

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

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // ─── Dark Mode Toggle ───
    const darkToggle = document.getElementById('dark-toggle');
    const darkMoonIcon = document.querySelector('.icon-toggle-moon');
    const darkSunIcon = document.querySelector('.icon-toggle-sun');
    const darkLabel = document.querySelector('.dark-toggle-label');
    const isDark = localStorage.getItem('dark') === '1';
    if (isDark) {
        document.body.classList.add('dark');
        if (darkMoonIcon) darkMoonIcon.style.display = 'none';
        if (darkSunIcon)  darkSunIcon.style.display  = '';
        if (darkLabel) darkLabel.textContent = 'Light';
    }
    darkToggle.addEventListener('click', () => {
        const on = document.body.classList.toggle('dark');
        if (darkMoonIcon) darkMoonIcon.style.display = on ? 'none' : '';
        if (darkSunIcon)  darkSunIcon.style.display  = on ? '' : 'none';
        if (darkLabel) darkLabel.textContent = on ? 'Light' : 'Dark';
        localStorage.setItem('dark', on ? '1' : '0');
    });

    // ─── Countdown ───
    const DEADLINE = new Date('2026-05-26T14:00:00-03:00');
    function updateCountdown() {
        const now = new Date();
        const diff = DEADLINE - now;
        if (diff <= 0) {
            document.getElementById('cd-days').textContent = '0';
            document.getElementById('cd-hours').textContent = '00';
            document.getElementById('cd-mins').textContent = '00';
            document.getElementById('cd-secs').textContent = '00';
            return;
        }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        document.getElementById('cd-days').textContent = d;
        document.getElementById('cd-hours').textContent = String(h).padStart(2, '0');
        document.getElementById('cd-mins').textContent = String(m).padStart(2, '0');
        document.getElementById('cd-secs').textContent = String(s).padStart(2, '0');
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ─── FAQ Accordion ───
    document.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });


    // ─── File Upload Preview ───
    const adjuntosInput = document.getElementById('adjuntos');
    const fileList = document.getElementById('file-list');
    const fileUploadLabel = document.getElementById('file-upload-label');
    const fileUploadWrapper = document.getElementById('file-upload-wrapper');

    function updateFileList(files) {
        if (!files || files.length === 0) {
            fileList.style.display = 'none';
            fileUploadLabel.textContent = 'Seleccionar archivos o arrastrar aquí';
            return;
        }
        fileUploadLabel.textContent = `${files.length} archivo${files.length > 1 ? 's' : ''} seleccionado${files.length > 1 ? 's' : ''}`;
        fileList.style.display = 'block';
        fileList.innerHTML = '';
        Array.from(files).forEach(file => {
            const sizeMB = (file.size / 1024 / 1024).toFixed(2);
            const li = document.createElement('li');
            li.style.cssText = 'display:flex;align-items:center;gap:0.5rem;padding:0.4rem 0.6rem;background:rgba(255,255,255,0.05);border-radius:6px;margin-bottom:0.4rem;font-size:0.82rem;';
            li.innerHTML = `<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${file.name}</span><span style="color:var(--text-dim);font-size:0.75rem;white-space:nowrap;">${sizeMB} MB</span>`;
            fileList.appendChild(li);
        });
    }

    adjuntosInput.addEventListener('change', () => updateFileList(adjuntosInput.files));

    // Drag & drop
    fileUploadWrapper.addEventListener('dragover', e => { e.preventDefault(); fileUploadWrapper.style.borderColor = 'var(--accent-dark)'; });
    fileUploadWrapper.addEventListener('dragleave', () => { fileUploadWrapper.style.borderColor = ''; });
    fileUploadWrapper.addEventListener('drop', e => {
        e.preventDefault();
        fileUploadWrapper.style.borderColor = '';
        adjuntosInput.files = e.dataTransfer.files;
        updateFileList(e.dataTransfer.files);
    });

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
            timestamp: serverTimestamp()
        };

        const scriptURL = 'https://script.google.com/macros/s/AKfycbydzqBbLDLa6odKwxH0MVlbV00wIcd6foYxmhIPDWYzE_xkxL98Q6OeQYcBg7fMn50O/exec';

        try {
            // 1. Subir archivos a Firebase Storage
            btn.innerHTML = 'Subiendo archivos...';
            const adjuntosFiles = document.getElementById('adjuntos').files;
            const adjuntosURLs = [];

            if (adjuntosFiles && adjuntosFiles.length > 0) {
                for (const file of adjuntosFiles) {
                    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
                    const storageRef = ref(storage, `submissions/${payload.empresa}/${Date.now()}_${safeName}`);
                    const snapshot = await uploadBytes(storageRef, file);
                    const url = await getDownloadURL(snapshot.ref);
                    adjuntosURLs.push({ nombre: file.name, url });
                }
            }

            // 2. Guardar en Firestore con URLs de archivos
            btn.innerHTML = 'Guardando entrega...';
            await addDoc(collection(db, 'submissions'), {
                ...payload,
                adjuntos: adjuntosURLs
            });

            // 3. Backup en Google Sheets
            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({ ...payload, type: 'proyecto', timestamp: new Date().toISOString() })
            }).catch(e => console.warn('Script backup failed', e));

            showToast(`Entrega recibida. ¡Éxitos en el taller!`);
            form.reset();
            integrantesContainer.innerHTML = '';
            integranteCount = 0;
            createIntegranteSelector();
            updateFileList(null); // limpiar preview de archivos
        } catch (err) {
            console.error('Firebase Error:', err);
            showToast(`Error: ${err.message || 'Intentá de nuevo'}`);
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });

    // ─── Admin Access (with animated modal) ───
    const adminModal = document.getElementById('admin-modal');
    const adminClose = document.getElementById('admin-close');

    function openModal() {
        adminModal.style.display = 'flex';
        requestAnimationFrame(() => adminModal.classList.add('open'));
        renderAdminPanel();
    }
    function closeModal() {
        adminModal.classList.remove('open');
        setTimeout(() => { adminModal.style.display = 'none'; }, 280);
    }

    adminTrigger.addEventListener('click', () => {
        const pass = prompt('Contraseña de administrador:');
        if (pass === 'hike2026') openModal();
    });
    adminClose.addEventListener('click', closeModal);
    adminModal.addEventListener('click', e => { if (e.target === adminModal) closeModal(); });

    // Export CSV
    document.getElementById('export-csv-btn').addEventListener('click', () => {
        const clase = document.querySelector('.admin-class-btn.active')?.dataset.class || 'clase-1';
        const allStudents = [...(studentData['14-16'] || []), ...(studentData['16-18'] || [])];
        const records = currentAttendance.filter(a => a.clase === clase);
        const rows = [['Nombre', 'Comisión', 'Estado', 'Timestamp']];
        allStudents.forEach(s => {
            const rec = records.find(a => a.nombre === s.name);
            const com = rec?.comision || (studentData['14-16'].find(x => x.name === s.name) ? '14-16' : '16-18');
            const ts = rec?.timestamp?.toDate ? rec.timestamp.toDate().toLocaleString('es-AR') : rec?.timestamp ? new Date(rec.timestamp).toLocaleString('es-AR') : '';
            rows.push([s.name, com, rec ? 'Presente' : 'Ausente', ts]);
        });
        const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `asistencia_${clase}.csv`; a.click();
        URL.revokeObjectURL(url);
    });


    // Modal tabs
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.modal-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // Estado activo de la vista admin
    let activeClass = 'clase-1';
    let activeComision = 'all';

    // Admin class tabs (por clase)
    document.querySelectorAll('.admin-class-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.admin-class-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeClass = btn.dataset.class;
            renderAttendanceList(activeClass, activeComision);
        });
    });

    // Admin commission tabs (por comisión)
    document.querySelectorAll('.admin-com-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.admin-com-btn').forEach(b => {
                b.style.background = 'transparent';
                b.style.color = 'var(--text-dim)';
                b.style.borderColor = 'var(--border)';
                b.classList.remove('active');
            });
            btn.classList.add('active');
            btn.style.background = 'var(--accent-dark)';
            btn.style.color = '#fff';
            btn.style.borderColor = 'var(--accent-dark)';
            activeComision = btn.dataset.com;
            renderAttendanceList(activeClass, activeComision);
        });
    });

    // --- AUTH & INITIALIZATION ---
    signInAnonymously(auth).catch(err => {
        console.error("Auth Error:", err);
        showToast("Error de conexión con el servidor.");
    });

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("Authenticated anonymously:", user.uid);
            initFirestoreListeners();
        }
    });

    function initFirestoreListeners() {
        const qAttendance = query(collection(db, 'attendance'), orderBy('timestamp', 'desc'));
        onSnapshot(qAttendance, (snapshot) => {
            currentAttendance = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const activeTab = document.querySelector('.admin-class-btn.active');
            if (activeTab) renderAttendanceList(activeTab.dataset.class);
        });

        const qSubmissions = query(collection(db, 'submissions'), orderBy('timestamp', 'desc'));
        onSnapshot(qSubmissions, (snapshot) => {
            currentSubmissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderSubmissionsList();
        });
    }

    function renderAttendanceList(clase, comision = 'all') {
        const list = document.getElementById('admin-attendance-list');

        // Filtrar alumnos por comisión seleccionada
        let allStudents;
        if (comision === '14-16') {
            allStudents = studentData['14-16'] || [];
        } else if (comision === '16-18') {
            allStudents = studentData['16-18'] || [];
        } else {
            allStudents = [...(studentData['14-16'] || []), ...(studentData['16-18'] || [])];
        }

        // Filtrar registros de asistencia por clase (y comisión si aplica)
        const presentRecords = currentAttendance.filter(a => {
            const matchClase = a.clase === clase;
            const matchComision = comision === 'all' || a.comision === comision;
            return matchClase && matchComision;
        });
        const presentNames = presentRecords.map(a => a.nombre);

        const present = allStudents.filter(s => presentNames.includes(s.name));
        const absent  = allStudents.filter(s => !presentNames.includes(s.name));

        list.innerHTML = `<p class="admin-counter">${present.length} presentes / ${allStudents.length} totales</p>`;

        present.forEach(s => {
            const record = presentRecords.find(a => a.nombre === s.name);
            const ts = record?.timestamp?.toDate ? record.timestamp.toDate() : new Date(record?.timestamp);
            list.innerHTML += `<div class="admin-row">
                <span class="admin-row-name">${s.name}</span>
                <div style="display:flex;gap:0.5rem;align-items:center;">
                    <span class="admin-row-meta">${record?.timestamp ? ts.toLocaleString('es-AR', {day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : 'Sincronizando...'}</span>
                    <span class="admin-badge admin-badge--present">Presente</span>
                </div>
            </div>`;
        });
        absent.forEach(s => {
            list.innerHTML += `<div class="admin-row">
                <span class="admin-row-name" style="color:var(--text-dim)">${s.name}</span>
                <span class="admin-badge admin-badge--absent">Ausente</span>
            </div>`;
        });
    }

    function renderSubmissionsList() {
        const list = document.getElementById('admin-submissions-list');

        if (currentSubmissions.length === 0) {
            list.innerHTML = '<p class="admin-empty">No hay entregas registradas todavía.</p>';
            return;
        }

        list.innerHTML = `<p class="admin-counter">${currentSubmissions.length} entrega${currentSubmissions.length > 1 ? 's' : ''} recibida${currentSubmissions.length > 1 ? 's' : ''}</p>`;

        currentSubmissions.forEach(s => {
            const ts = s.timestamp?.toDate ? s.timestamp.toDate() : new Date(s.timestamp);
            const fechaStr = s.timestamp ? ts.toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

            const linksHTML = (s.links || []).filter(l => l).map(l =>
                `<a href="${l}" target="_blank" rel="noopener" style="display:block;color:var(--accent-dark);font-size:0.8rem;word-break:break-all;margin-bottom:0.2rem;text-decoration:underline;">${l}</a>`
            ).join('') || '<span style="color:var(--text-dim);font-size:0.8rem;">Sin links</span>';

            const integrantesHTML = (s.integrantes || []).map(i =>
                `<span style="display:inline-block;background:rgba(88,56,163,0.12);color:var(--accent-dark);border-radius:999px;padding:0.15rem 0.6rem;font-size:0.75rem;margin:0.15rem 0.1rem;">${i.nombre}</span>`
            ).join('');

            list.innerHTML += `
            <div style="border:1px solid var(--border);border-radius:12px;padding:1rem 1.25rem;margin-bottom:0.75rem;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.75rem;">
                    <div>
                        <span class="admin-row-name" style="font-size:1rem;">${s.empresa || 'Sin nombre'}</span>
                        <span class="admin-row-meta" style="display:block;margin-top:0.2rem;">${s.comision || '—'} · ${fechaStr}</span>
                    </div>
                    <span class="admin-badge admin-badge--submitted">Entregado</span>
                </div>
                <div style="margin-bottom:0.6rem;">
                    <span style="font-size:0.72rem;font-weight:600;letter-spacing:0.05em;color:var(--text-dim);text-transform:uppercase;">Equipo</span>
                    <div style="margin-top:0.3rem;">${integrantesHTML}</div>
                </div>
                <div style="margin-bottom:0.6rem;">
                    <span style="font-size:0.72rem;font-weight:600;letter-spacing:0.05em;color:var(--text-dim);text-transform:uppercase;">Links del Proyecto</span>
                    <div style="margin-top:0.3rem;">${linksHTML}</div>
                </div>
                ${s.comments ? `
                <div style="margin-bottom:0.4rem;">
                    <span style="font-size:0.72rem;font-weight:600;letter-spacing:0.05em;color:var(--text-dim);text-transform:uppercase;">Proceso & Herramientas</span>
                    <p style="margin-top:0.3rem;font-size:0.82rem;color:var(--text-dim);line-height:1.5;">${s.comments}</p>
                </div>` : ''}
                ${s.adjuntos && s.adjuntos.length > 0 ? `
                <div>
                    <span style="font-size:0.72rem;font-weight:600;letter-spacing:0.05em;color:var(--text-dim);text-transform:uppercase;">Archivos Adjuntos</span>
                    <div style="margin-top:0.3rem;">
                        ${s.adjuntos.map(a => `
                            <a href="${a.url}" target="_blank" rel="noopener"
                               style="display:inline-flex;align-items:center;gap:0.3rem;background:rgba(88,56,163,0.1);color:var(--accent-dark);border-radius:6px;padding:0.25rem 0.6rem;font-size:0.78rem;text-decoration:none;margin:0.2rem 0.15rem;">
                               <i data-lucide="paperclip" style="width:14px;height:14px;"></i> ${a.nombre}
                            </a>`).join('')}
                    </div>
                </div>` : ''}
            </div>`;
        });
    }

    // (Se eliminó el backup de localStorage para favorecer Firestore)

    // ─── Attendance Form ───
    const attForm = document.getElementById('attendance-form');
    const attComision = document.getElementById('att-comision');
    const attAlumno = document.getElementById('att-alumno');

    attComision.addEventListener('change', () => {
        const com = attComision.value;
        attAlumno.innerHTML = '<option value="">Seleccionar alumno...</option>';
        if (com && studentData[com]) {
            studentData[com].forEach(s => {
                attAlumno.innerHTML += `<option value="${s.name}">${s.name}</option>`;
            });
        }
    });

    // Personal mini-dashboard: update when student name changes
    attAlumno.addEventListener('change', () => updatePersonalDashboard());

    function updatePersonalDashboard() {
        const nombre = attAlumno.value;
        if (!nombre) return;
        const dash = document.getElementById('personal-dashboard');
        const greeting = document.getElementById('dashboard-greeting');
        const dsAtt = document.getElementById('ds-att');
        const dsSub = document.getElementById('ds-sub');
        const dsTime = document.getElementById('ds-time');

        const firstName = nombre.split(' ')[0];
        greeting.textContent = `Hola, ${firstName}`;

        // Asistencia: check all 3 classes
        const attClases = ['clase-1', 'clase-2', 'clase-3'].filter(c =>
            currentAttendance.some(a => a.nombre === nombre && a.clase === c)
        );
        dsAtt.className = 'dashboard-status-value ' + (attClases.length > 0 ? 'ds-ok' : 'ds-no');
        dsAtt.textContent = attClases.length > 0 ? `${attClases.length}/3 clases` : 'Sin registros';

        // Entrega
        const hasSub = currentSubmissions.some(s =>
            (s.integrantes || []).some(i => i.nombre === nombre)
        );
        dsSub.className = 'dashboard-status-value ' + (hasSub ? 'ds-ok' : 'ds-dim');
        dsSub.textContent = hasSub ? 'Entregado' : 'Pendiente';

        // Tiempo restante
        const diff = DEADLINE - new Date();
        if (diff > 0) {
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            dsTime.className = 'dashboard-status-value ' + (d < 3 ? 'ds-no' : 'ds-dim');
            dsTime.textContent = `${d}d ${h}h restantes`;
        } else {
            dsTime.className = 'dashboard-status-value ds-no';
            dsTime.textContent = 'Plazo vencido';
        }
    }

    attForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = attAlumno.value;
        const clase = document.getElementById('att-clase').value;
        const declared = document.getElementById('att-declaration').checked;
        const submitBtn = document.getElementById('att-submit-btn');

        if (!nombre || !clase || !declared) {
            showToast('Completá todos los campos y la declaración.');
            return;
        }

        // 1. Verificar si ya registró asistencia para esta clase
        const q = query(
            collection(db, 'attendance'),
            where('nombre', '==', nombre),
            where('clase', '==', clase)
        );

        try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                showToast('Ya registraste asistencia para esta clase.');
                submitBtn.textContent = 'Presente registrado';
                submitBtn.disabled = true;
                submitBtn.style.background = '#16a34a';
                return;
            }

            submitBtn.textContent = 'Registrando...';
            submitBtn.disabled = true;

            const payload = {
                comision: attComision.value,
                nombre: nombre,
                clase: clase,
                timestamp: serverTimestamp()
            };

            const scriptURL = 'https://script.google.com/macros/s/AKfycbydzqBbLDLa6odKwxH0MVlbV00wIcd6foYxmhIPDWYzE_xkxL98Q6OeQYcBg7fMn50O/exec';

            // 2. Guardar en Firestore
            await addDoc(collection(db, 'attendance'), payload);

            // 3. Backup en Google Sheets
            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({ ...payload, type: 'asistencia', timestamp: new Date().toISOString() })
            }).catch(e => console.warn('Script backup failed', e));

            submitBtn.textContent = 'Presente registrado';
            submitBtn.style.background = '#16a34a';
            showToast(`Presente registrado: ${nombre}`);
            updatePersonalDashboard();
        } catch (err) {
            console.error('Firestore Error:', err);
            showToast(`Error: ${err.message || 'Intentá de nuevo'}`);
            submitBtn.textContent = 'Registrar asistencia';
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }
    });
});
