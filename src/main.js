import { auth, db, storage } from './firebase.js';
import { 
    collection, 
    addDoc, 
    onSnapshot, 
    query, 
    orderBy, 
    where, 
    getDocs,
    updateDoc,
    doc,
    serverTimestamp,
    arrayUnion
} from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { COHORT_ID, DEADLINE, APPS_SCRIPT_URL, CLASSES, COMISIONES, studentData, belongsToCohort } from './cohort.js';
import { escapeHtml, safeUrl } from './html.js';

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
    let editingSubmissionId = null; // Track if we are updating an existing entry

    // ─── Opciones de comisión y clase (desde cohort.js) ───
    function fillOptions(select, items) {
        items.forEach(({ value, label }) => select.add(new Option(label, value)));
    }
    const comisionOptions = COMISIONES.map(c => ({ value: c.key, label: c.label }));
    fillOptions(comisionSelect, comisionOptions);
    fillOptions(document.getElementById('att-comision'), comisionOptions);
    fillOptions(document.getElementById('att-clase'), CLASSES.map(c => ({ value: c.key, label: c.formLabel })));

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
    function updateCountdown() {
        if (!DEADLINE) return; // Fecha a definir: el countdown queda en "--"
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
            li.innerHTML = `<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(file.name)}</span><span style="color:var(--text-dim);font-size:0.75rem;white-space:nowrap;">${sizeMB} MB</span>`;
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

    function addLinkInput(value = '') {
        const input = document.createElement('input');
        input.type = 'url';
        input.name = 'project-link';
        input.placeholder = 'https://...';
        input.style.marginBottom = '1rem';
        input.value = value;
        linksContainer.appendChild(input);
    }

    addLinkBtn.addEventListener('click', () => addLinkInput());

    // ─── Form Submission ───
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
            editCode: document.getElementById('edit-code').value, // El código original (con mayúsculas/minúsculas)
            searchCode: document.getElementById('edit-code').value.toLowerCase().trim(), // El código normalizado para búsqueda
            timestamp: serverTimestamp()
        };

        try {
            // Un código repetido haría que "Editar Entrega" traiga la entrega de otro grupo
            if (await isEditCodeTaken(payload.searchCode, editingSubmissionId)) {
                showToast('Ese código de seguridad ya lo usa otro grupo. Elegí otro.');
                return;
            }

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
            if (editingSubmissionId) {
                // Actualizar existente. Se conserva el timestamp original (define si la
                // entrega fue a tiempo) y los archivos nuevos se suman a los anteriores.
                const { timestamp, ...changes } = payload;
                await updateDoc(doc(db, 'submissions', editingSubmissionId), {
                    ...changes,
                    updatedAt: serverTimestamp(),
                    ...(adjuntosURLs.length > 0 && { adjuntos: arrayUnion(...adjuntosURLs) })
                });
                showToast(`Entrega actualizada correctamente.`);
            } else {
                // Nueva entrega
                await addDoc(collection(db, 'submissions'), {
                    ...payload,
                    cohorte: COHORT_ID,
                    adjuntos: adjuntosURLs
                });
                showToast(`Entrega recibida. ¡Éxitos en el taller!`);
            }

            // 3. Backup en Google Sheets
            fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({ ...payload, type: 'proyecto', timestamp: new Date().toISOString() })
            }).catch(e => console.warn('Script backup failed', e));

            form.reset();
            editingSubmissionId = null;
            document.getElementById('edit-files-info').style.display = 'none';
            document.getElementById('edit-files-list').innerHTML = '';
            integrantesContainer.innerHTML = '';
            integranteCount = 0;
            createIntegranteSelector();
            updateFileList(null); // limpiar preview de archivos
        } catch (err) {
            console.error('Firebase Error:', err);
            showToast(`Error: ${err.message || 'Intentá de nuevo'}`);
        } finally {
            btn.innerHTML = editingSubmissionId ? 'Actualizar Entrega ↗' : 'Enviar Entrega Grupal ↗';
            btn.disabled = false;
        }
    });

    async function isEditCodeTaken(searchCode, ownId) {
        const snap = await getDocs(query(collection(db, 'submissions'), where('searchCode', '==', searchCode)));
        if (snap.docs.some(d => d.id !== ownId && belongsToCohort(d.data()))) return true;
        // Entregas viejas sin searchCode: se comparan contra la lista ya cargada
        return currentSubmissions.some(s =>
            s.id !== ownId && !s.searchCode && (s.editCode || '').toLowerCase().trim() === searchCode
        );
    }

    // ─── Search & Edit Submission Modal ───
    const searchBtn = document.getElementById('search-delivery-btn');
    const editModal = document.getElementById('edit-modal');
    const closeEditModal = document.getElementById('close-edit-modal');
    const confirmEditBtn = document.getElementById('confirm-edit-btn');
    const inputEditCode = document.getElementById('input-edit-code');

    searchBtn.addEventListener('click', () => {
        editModal.style.display = 'flex';
        requestAnimationFrame(() => editModal.classList.add('open'));
        inputEditCode.value = '';
        inputEditCode.focus();
    });

    function closeEdit() {
        editModal.classList.remove('open');
        setTimeout(() => { editModal.style.display = 'none'; }, 280);
    }

    closeEditModal.addEventListener('click', closeEdit);

    confirmEditBtn.addEventListener('click', async () => {
        const rawCode = inputEditCode.value.trim();
        if (!rawCode) return;
        const searchCode = rawCode.toLowerCase();

        confirmEditBtn.innerHTML = 'Buscando...';
        confirmEditBtn.disabled = true;

        try {
            let q = query(
                collection(db, 'submissions'),
                where('searchCode', '==', searchCode)
            );
            let matches = (await getDocs(q)).docs.filter(d => belongsToCohort(d.data()));

            // Fallback para entregas viejas que no tienen searchCode
            if (matches.length === 0) {
                q = query(
                    collection(db, 'submissions'),
                    where('editCode', '==', rawCode)
                );
                matches = (await getDocs(q)).docs.filter(d => belongsToCohort(d.data()));
            }

            if (matches.length === 0) {
                showToast('No se encontró ninguna entrega con ese código.');
                confirmEditBtn.innerHTML = 'Buscar mi Entrega ↗';
                confirmEditBtn.disabled = false;
                return;
            }

            const docSnap = matches[0];
            const data = docSnap.data();
            editingSubmissionId = docSnap.id;

            // Cargar datos en el formulario
            comisionSelect.value = data.comision || COMISIONES[0].key;
            document.getElementById('empresa').value = data.empresa || '';
            document.getElementById('comentarios').value = data.comments || '';
            if (document.getElementById('edit-code')) {
                document.getElementById('edit-code').value = data.editCode || data.searchCode || '';
            }

            // Cargar integrantes
            integrantesContainer.innerHTML = '';
            integranteCount = 0;
            if (data.integrantes && data.integrantes.length > 0) {
                data.integrantes.forEach(int => {
                    createIntegranteSelector();
                    const rows = integrantesContainer.querySelectorAll('.integrante-row');
                    const lastRow = rows[rows.length - 1];
                    lastRow.querySelector('.alumno-select').value = int.nombre;
                    lastRow.querySelector('.alumno-email').value = int.email;
                });
            } else {
                createIntegranteSelector();
            }

            // Cargar links
            linksContainer.innerHTML = '';
            if (data.links && data.links.length > 0) {
                data.links.forEach(link => addLinkInput(link));
            } else {
                addLinkInput();
            }

            // Mostrar archivos ya subidos
            const filesInfo = document.getElementById('edit-files-info');
            const filesList = document.getElementById('edit-files-list');
            if (data.adjuntos && data.adjuntos.length > 0) {
                filesInfo.style.display = 'block';
                filesList.innerHTML = data.adjuntos.map(a => {
                    const url = safeUrl(a.url);
                    const nombre = escapeHtml(a.nombre);
                    return `<li style="margin-bottom: 0.3rem;">• ${url ? `<a href="${escapeHtml(url)}" target="_blank" style="color:var(--accent-dark);text-decoration:underline;">${nombre}</a>` : nombre}</li>`;
                }).join('');
            } else {
                filesInfo.style.display = 'none';
            }

            document.getElementById('submit-delivery-btn').innerHTML = 'Actualizar Entrega ↗';
            closeEdit();
            window.scrollTo({ top: document.getElementById('deliver').offsetTop - 100, behavior: 'smooth' });
            showToast('¡Entrega cargada! Ahora podés editarla.');

        } catch (err) {
            console.error('Error searching submission:', err);
            showToast('Error al buscar la entrega.');
        } finally {
            confirmEditBtn.innerHTML = 'Buscar mi Entrega ↗';
            confirmEditBtn.disabled = false;
        }
    });

    // ─── Admin ───
    // El panel de administración vive en /admin.html
    adminTrigger.addEventListener('click', () => {
        window.location.href = '/admin.html';
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

    // Asistencias y entregas del cuatrimestre, para el mini-dashboard del alumno
    function initFirestoreListeners() {
        const qAttendance = query(collection(db, 'attendance'), orderBy('timestamp', 'desc'));
        onSnapshot(qAttendance, (snapshot) => {
            currentAttendance = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(belongsToCohort);
            updatePersonalDashboard();
        });

        const qSubmissions = query(collection(db, 'submissions'), orderBy('timestamp', 'desc'));
        onSnapshot(qSubmissions, (snapshot) => {
            currentSubmissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(belongsToCohort);
            updatePersonalDashboard();
        });
    }

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

        // Asistencia: check all classes
        const attClases = CLASSES.filter(c =>
            currentAttendance.some(a => a.nombre === nombre && a.clase === c.key)
        );
        dsAtt.className = 'dashboard-status-value ' + (attClases.length > 0 ? 'ds-ok' : 'ds-no');
        dsAtt.textContent = attClases.length > 0 ? `${attClases.length}/${CLASSES.length} clases` : 'Sin registros';

        // Entrega
        const hasSub = currentSubmissions.some(s =>
            (s.integrantes || []).some(i => i.nombre === nombre)
        );
        dsSub.className = 'dashboard-status-value ' + (hasSub ? 'ds-ok' : 'ds-dim');
        dsSub.textContent = hasSub ? 'Entregado' : 'Pendiente';

        // Tiempo restante
        const diff = DEADLINE ? DEADLINE - new Date() : null;
        if (diff === null) {
            dsTime.className = 'dashboard-status-value ds-dim';
            dsTime.textContent = 'A definir';
        } else if (diff > 0) {
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
            if (querySnapshot.docs.some(d => belongsToCohort(d.data()))) {
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

            // 2. Guardar en Firestore
            await addDoc(collection(db, 'attendance'), { ...payload, cohorte: COHORT_ID });

            // 3. Backup en Google Sheets
            fetch(APPS_SCRIPT_URL, {
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
