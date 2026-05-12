import { auth, db } from './firebase.js';
import {
    collection, onSnapshot, query, orderBy,
    doc, setDoc, serverTimestamp, arrayUnion
} from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// ── Student data ──────────────────────────────────────────────
const studentData = {
    "14-16": [
        { name: "Valentina Angeleri" }, { name: "Mateo Beumont" },
        { name: "Francisco Bruzone" }, { name: "Benjamin Burgo" },
        { name: "Mora Cier" }, { name: "Pedro Deluchi" },
        { name: "Camila María de Salas" }, { name: "Iñaki Dominguez" },
        { name: "Ignacio Domnanovich" }, { name: "Juan Ignacio Fabbro" },
        { name: "Milagros Fernandez" }, { name: "Renata Lucía Fernández" },
        { name: "Ignacio Gomez Galissier" }, { name: "Joaquin Albano Harguindeguy" },
        { name: "Lucas Leonard" }, { name: "Trinidad Leonard" },
        { name: "Mateo Josue Leonov" }, { name: "Santiago Martinez Alvarez" },
        { name: "Lourdes Massuh" }, { name: "Benjamin Merhar" },
        { name: "Camila Nemes Meier" }, { name: "Augusto Piepenbrink" },
        { name: "Josefina Sfilio Glassmann" }, { name: "Martina Soto" },
        { name: "Nicolas Martin Torres" }, { name: "Bauti Ballatore" }
    ],
    "16-18": [
        { name: "Mateo Ignacio Aldazabal" }, { name: "Bernardino de Aldecoa" },
        { name: "Valentin Del Pino" }, { name: "Guadalupe Fernandez Garcia" },
        { name: "Facundo Leon García Lorenzi" }, { name: "Juan Ignacio Gomez Cruz" },
        { name: "Eliseo Juan Laborde" }, { name: "Juan Cruz López" },
        { name: "Trinidad Maydana" }, { name: "Ignacio Luca Montovio" },
        { name: "Tiziano Rossignuolo" }, { name: "Miguel Agustin Rozas" },
        { name: "Salvador Sanchez Pujol" }, { name: "Abril Santeusanio" },
        { name: "Ana Sixto" }, { name: "Jose Maria Solanet Zimmermann" },
        { name: "Renata Staffolani" }, { name: "Lucila Tomys de Mello" }
    ]
};

const CLASSES = [
    { key: 'clase-1', label: 'Clase 1 · 5 May' },
    { key: 'clase-2', label: 'Clase 2 · 12 May' },
    { key: 'clase-3', label: 'Clase 3 · 19 May' },
];

// ── State ─────────────────────────────────────────────────────
let attendance = [];
let submissions = [];
let studentNotes = {}; // { [studentKey]: { note, updatedAt } }
let activeClass = 'clase-1';
let activeCom = 'all';
let activeSubCom = 'all';
let activeStudentsCom = 'all';
let openStudentName = null;
let selectedGrade = null; // 1-10

// ── Login ─────────────────────────────────────────────────────
const PASS = 'hike2026';
const loginScreen = document.getElementById('login-screen');
const adminApp = document.getElementById('admin-app');
const loginBtn = document.getElementById('login-btn');
const passInput = document.getElementById('pass-input');
const loginError = document.getElementById('login-error');

function tryLogin() {
    if (passInput.value === PASS) {
        loginScreen.style.display = 'none';
        adminApp.style.display = 'block';
        initFirebase();
    } else {
        loginError.style.display = 'block';
        passInput.value = '';
        passInput.focus();
    }
}
loginBtn.addEventListener('click', tryLogin);
passInput.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });
document.getElementById('logout-btn').addEventListener('click', () => location.reload());

// ── Firebase ──────────────────────────────────────────────────
function initFirebase() {
    signInAnonymously(auth).catch(console.error);
    onAuthStateChanged(auth, user => {
        if (!user) return;
        document.getElementById('sync-label').textContent = 'En vivo';

        onSnapshot(query(collection(db, 'attendance'), orderBy('timestamp', 'desc')), snap => {
            attendance = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            renderAttendance();
            renderStudents();
            if (openStudentName) renderNotesDrawer(openStudentName);
        });
        onSnapshot(query(collection(db, 'submissions'), orderBy('timestamp', 'desc')), snap => {
            submissions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            renderSubmissions();
            renderStudents();
            if (openStudentName) renderNotesDrawer(openStudentName);
        });

        // Load all student notes as a map
        onSnapshot(collection(db, 'studentNotes'), snap => {
            studentNotes = {};
            snap.docs.forEach(d => { studentNotes[d.id] = d.data(); });
            renderStudents();
            if (openStudentName) renderNotesDrawer(openStudentName);
        });
    });
}

// ── Sidebar nav ───────────────────────────────────────────────
document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`page-${btn.dataset.page}`).classList.add('active');
    });
});

// ── Attendance filters ────────────────────────────────────────
document.querySelectorAll('[data-class-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('[data-class-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeClass = btn.dataset.classFilter;
        renderAttendance();
    });
});
document.querySelectorAll('[data-com-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('[data-com-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCom = btn.dataset.comFilter;
        renderAttendance();
    });
});

// ── Submissions filters ───────────────────────────────────────
document.querySelectorAll('[data-sub-com]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('[data-sub-com]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeSubCom = btn.dataset.subCom;
        renderSubmissions();
    });
});

// ── Grade helper ─────────────────────────────────────────────
function gradeClass(g) {
    if (!g) return '';
    if (g <= 4) return 'active-grade-low';
    if (g <= 6) return 'active-grade-mid';
    return 'active-grade-high';
}
function gradeBadgeClass(g) {
    if (!g) return '';
    if (g <= 4) return 'grade-badge-low';
    if (g <= 6) return 'grade-badge-mid';
    return 'grade-badge-high';
}

// ── Grade picker ──────────────────────────────────────────────
document.querySelectorAll('.grade-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const g = parseInt(btn.dataset.grade);
        selectedGrade = (selectedGrade === g) ? null : g; // toggle off if same
        updateGradePicker();
    });
});

function updateGradePicker() {
    document.querySelectorAll('.grade-btn').forEach(btn => {
        const g = parseInt(btn.dataset.grade);
        btn.className = 'grade-btn';
        if (g === selectedGrade) btn.classList.add(gradeClass(g));
    });
}

// ── Students filter ───────────────────────────────────────────
document.querySelectorAll('[data-students-com]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('[data-students-com]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeStudentsCom = btn.dataset.studentsCom;
        renderStudents();
    });
});

// ── CSV Export ────────────────────────────────────────────────
document.getElementById('export-csv-btn').addEventListener('click', () => {
    const allStudents = [...studentData['14-16'], ...studentData['16-18']];
    const rows = [['Nombre', 'Comisión', 'Clase 1', 'Clase 2', 'Clase 3', 'Entrega']];
    allStudents.forEach(s => {
        const com = studentData['14-16'].find(x => x.name === s.name) ? '14-16' : '16-18';
        const cls = CLASSES.map(c => {
            const rec = attendance.find(a => a.nombre === s.name && a.clase === c.key);
            return rec ? 'Presente' : 'Ausente';
        });
        const hasSub = submissions.some(sub =>
            (sub.integrantes || []).some(i => i.nombre === s.name)
        );
        rows.push([s.name, com, ...cls, hasSub ? 'Entregado' : 'Pendiente']);
    });
    const csv = rows.map(r => r.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `asistencia-austral-${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
});

// ── Render Attendance ─────────────────────────────────────────
function renderAttendance() {
    const allStudents = activeCom === '14-16' ? studentData['14-16']
        : activeCom === '16-18' ? studentData['16-18']
        : [...studentData['14-16'], ...studentData['16-18']];

    const records = attendance.filter(a => {
        const matchClass = a.clase === activeClass;
        const matchCom = activeCom === 'all' || a.comision === activeCom;
        return matchClass && matchCom;
    });
    const presentNames = records.map(a => a.nombre);

    const total = allStudents.length;
    const presentCount = allStudents.filter(s => presentNames.includes(s.name)).length;
    const pct = total ? Math.round(presentCount / total * 100) : 0;
    document.getElementById('att-scorecards').innerHTML = `
        <div class="scorecard">
            <div class="scorecard-label">Presentes</div>
            <div class="scorecard-value">${presentCount}</div>
            <div class="scorecard-sub">de ${total} alumnos</div>
        </div>
        <div class="scorecard">
            <div class="scorecard-label">Ausentes</div>
            <div class="scorecard-value">${total - presentCount}</div>
            <div class="scorecard-sub">${100 - pct}% del total</div>
        </div>
        <div class="scorecard">
            <div class="scorecard-label">% Asistencia</div>
            <div class="scorecard-value" style="color:${pct >= 70 ? '#16a34a' : '#dc2626'}">${pct}%</div>
            <div class="scorecard-sub">esta clase</div>
        </div>
    `;

    const body = document.getElementById('att-table-body');
    body.innerHTML = '';
    allStudents.forEach(s => {
        const rec = records.find(a => a.nombre === s.name);
        const isPresent = !!rec;
        const com = isPresent ? rec.comision : (studentData['14-16'].find(x => x.name === s.name) ? '14-16' : '16-18');
        const ts = rec?.timestamp?.toDate ? rec.timestamp.toDate() : rec?.timestamp ? new Date(rec.timestamp) : null;
        const tsStr = ts ? ts.toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';
        body.innerHTML += `
        <div class="table-row">
            <span class="student-name">${s.name}</span>
            <span class="ts-label">${com}</span>
            <span class="ts-label">${tsStr}</span>
            <span class="badge ${isPresent ? 'badge-present' : 'badge-absent'}">${isPresent ? 'Presente' : 'Ausente'}</span>
        </div>`;
    });
}

// ── Render Submissions ────────────────────────────────────────
function renderSubmissions() {
    const filtered = activeSubCom === 'all' ? submissions : submissions.filter(s => s.comision === activeSubCom);

    const total14 = submissions.filter(s => s.comision === '14-16').length;
    const total16 = submissions.filter(s => s.comision === '16-18').length;
    document.getElementById('sub-scorecards').innerHTML = `
        <div class="scorecard">
            <div class="scorecard-label">Total Entregas</div>
            <div class="scorecard-value">${submissions.length}</div>
            <div class="scorecard-sub">grupos en total</div>
        </div>
        <div class="scorecard">
            <div class="scorecard-label">Comisión 14-16</div>
            <div class="scorecard-value">${total14}</div>
            <div class="scorecard-sub">entregas recibidas</div>
        </div>
        <div class="scorecard">
            <div class="scorecard-label">Comisión 16-18</div>
            <div class="scorecard-value">${total16}</div>
            <div class="scorecard-sub">entregas recibidas</div>
        </div>
    `;

    const grid = document.getElementById('sub-grid');
    if (filtered.length === 0) {
        grid.innerHTML = '<p class="empty">No hay entregas registradas todavía.</p>';
        return;
    }
    grid.innerHTML = '';
    filtered.forEach(s => {
        const ts = s.timestamp?.toDate ? s.timestamp.toDate() : new Date(s.timestamp);
        const fecha = s.timestamp ? ts.toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

        const linksHTML = (s.links || []).filter(l => l).map(l =>
            `<a href="${l}" target="_blank" class="link-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:3px;"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>${l}
            </a>`).join('') || '<span style="color:#999;font-size:0.8rem;">Sin links</span>';

        const chips = (s.integrantes || []).map(i => `<span class="chip">${i.nombre}</span>`).join('');

        const filesHTML = (s.adjuntos || []).map(a => {
            const isImage = /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(a.nombre);
            return `
                <a href="${a.url}" target="_blank" class="file-chip">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                    ${a.nombre}
                </a>
                ${isImage ? `<img src="${a.url}" class="img-preview" alt="${a.nombre}" />` : ''}
            `;
        }).join('');

        grid.innerHTML += `
        <div class="sub-card">
            <div class="sub-card-header">
                <div>
                    <div class="sub-empresa">${s.empresa || 'Sin nombre'}</div>
                    <div class="sub-meta">${s.comision || '—'} · ${fecha}</div>
                </div>
                <span class="badge badge-submitted">Entregado</span>
            </div>
            <div class="sub-section-label">Integrantes</div>
            <div class="chips">${chips}</div>
            <div class="sub-section-label">Links del Proyecto</div>
            ${linksHTML}
            ${s.comments ? `<div class="sub-section-label">Proceso & Herramientas</div>
            <p style="font-size:0.82rem;color:#6b6080;line-height:1.55;">${s.comments}</p>` : ''}
            ${filesHTML ? `<div class="sub-section-label">Archivos</div>${filesHTML}` : ''}
        </div>`;
    });
}

// ── Render Students Grid ──────────────────────────────────────
function renderStudents() {
    const allStudents = activeStudentsCom === '14-16' ? studentData['14-16'].map(s => ({ ...s, com: '14-16' }))
        : activeStudentsCom === '16-18' ? studentData['16-18'].map(s => ({ ...s, com: '16-18' }))
        : [
            ...studentData['14-16'].map(s => ({ ...s, com: '14-16' })),
            ...studentData['16-18'].map(s => ({ ...s, com: '16-18' }))
        ];

    const grid = document.getElementById('students-grid');
    grid.innerHTML = '';
    allStudents.forEach(s => {
        const key = studentKey(s.name);
        const noteData = studentNotes[key];
        const hasNote = noteData?.note?.trim();
        const grade = noteData?.grade || null;
        const initials = s.name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();

        // Attendance dots per class
        const dots = CLASSES.map(c => {
            const present = attendance.some(a => a.nombre === s.name && a.clase === c.key);
            return `<span class="dot ${present ? 'dot-present' : 'dot-absent'}" title="${c.label}"></span>`;
        }).join('');

        // Submission check
        const hasSub = submissions.some(sub =>
            (sub.integrantes || []).some(i => i.nombre === s.name)
        );

        // Grade badge
        const gradeBadge = grade
            ? `<span class="student-grade-badge ${gradeBadgeClass(grade)}">${grade}/10</span>`
            : '';

        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <div class="student-avatar">${initials}</div>
            <div class="student-card-info">
                <div class="student-card-name">${s.name}</div>
                <div class="student-card-com">${s.com} ${hasSub ? '· <span style="color:#7c3aed;font-weight:600;">Entregó</span>' : ''}</div>
                <div class="student-card-dots" style="margin-top:0.4rem;">${dots}</div>
            </div>
            ${gradeBadge}
            ${hasNote ? `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5838A3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="has-note-icon" title="Tiene nota"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>` : ''}
        `;
        card.addEventListener('click', () => openStudentPanel(s.name));
        grid.appendChild(card);
    });
}

// ── Student Notes Panel ───────────────────────────────────────
function studentKey(name) {
    return name.toLowerCase().replace(/\s+/g, '_').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function openStudentPanel(name) {
    openStudentName = name;
    selectedGrade = null; // reset until loaded
    renderNotesDrawer(name);
    document.getElementById('notes-panel').classList.add('open');
}

function closeStudentPanel() {
    document.getElementById('notes-panel').classList.remove('open');
    openStudentName = null;
    selectedGrade = null;
}

document.getElementById('notes-close').addEventListener('click', closeStudentPanel);
document.getElementById('notes-backdrop').addEventListener('click', closeStudentPanel);

function renderNotesDrawer(name) {
    const key = studentKey(name);
    const com = studentData['14-16'].find(x => x.name === name) ? '14-16' : '16-18';
    const initials = name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();

    document.getElementById('notes-student-name').textContent = name;
    document.getElementById('notes-avatar').textContent = initials;

    // Stats
    const attCount = CLASSES.filter(c => attendance.some(a => a.nombre === name && a.clase === c.key)).length;
    const hasSub = submissions.some(sub => (sub.integrantes || []).some(i => i.nombre === name));
    const subGroup = submissions.find(sub => (sub.integrantes || []).some(i => i.nombre === name));
    const pct = Math.round(attCount / CLASSES.length * 100);
    document.getElementById('notes-stats').innerHTML = `
        <div class="notes-stat">
            <div class="notes-stat-label">Clases</div>
            <div class="notes-stat-val ${attCount > 0 ? 'green' : 'red'}">${attCount}/${CLASSES.length}</div>
        </div>
        <div class="notes-stat">
            <div class="notes-stat-label">Asistencia</div>
            <div class="notes-stat-val ${pct >= 67 ? 'green' : 'red'}">${pct}%</div>
        </div>
        <div class="notes-stat">
            <div class="notes-stat-label">Comisión</div>
            <div class="notes-stat-val" style="font-size:0.9rem;font-weight:600;">${com}</div>
        </div>
        <div class="notes-stat">
            <div class="notes-stat-label">Entrega</div>
            <div class="notes-stat-val ${hasSub ? 'purple' : 'red'}" style="font-size:0.85rem;">${hasSub ? 'Sí' : 'No'}</div>
        </div>
    `;

    // Classes detail
    document.getElementById('notes-classes').innerHTML = CLASSES.map(c => {
        const rec = attendance.find(a => a.nombre === name && a.clase === c.key);
        const present = !!rec;
        const ts = rec?.timestamp?.toDate ? rec.timestamp.toDate() : rec?.timestamp ? new Date(rec.timestamp) : null;
        const tsStr = ts ? ts.toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
        return `<div class="notes-class-item">
            <span>${c.label}</span>
            <span style="display:flex;align-items:center;gap:0.4rem;">
                ${tsStr ? `<span style="font-size:0.72rem;color:#6b6080;">${tsStr}</span>` : ''}
                <span class="badge ${present ? 'badge-present' : 'badge-absent'}">${present ? 'Presente' : 'Ausente'}</span>
            </span>
        </div>`;
    }).join('');

    // Submission block
    const subBlock = document.getElementById('notes-submission-block');
    if (hasSub && subGroup) {
        const teammates = (subGroup.integrantes || []).filter(i => i.nombre !== name).map(i => i.nombre).join(', ');
        subBlock.innerHTML = `
            <div class="notes-section-title">Entrega de Proyecto</div>
            <div class="notes-class-item" style="flex-direction:column;align-items:flex-start;gap:0.4rem;">
                <div style="font-weight:600;font-size:0.9rem;">${subGroup.empresa || 'Sin nombre'}</div>
                ${teammates ? `<div style="font-size:0.75rem;color:#6b6080;">Con: ${teammates}</div>` : ''}
                ${(subGroup.links || []).filter(l=>l).slice(0,2).map(l=>`<a href="${l}" target="_blank" style="font-size:0.75rem;color:#5838A3;word-break:break-all;">${l}</a>`).join('')}
            </div>
        `;
    } else {
        subBlock.innerHTML = `
            <div class="notes-section-title">Entrega de Proyecto</div>
            <div class="notes-class-item" style="color:#dc2626;font-size:0.82rem;">Sin entrega registrada</div>
        `;
    }

    // Load grade
    selectedGrade = studentNotes[key]?.grade || null;
    updateGradePicker();

    // Clear textarea
    document.getElementById('notes-textarea').value = '';

    // Render comment list
    const comments = studentNotes[key]?.comments || [];
    const commentsList = document.getElementById('notes-comments-list');
    if (comments.length === 0) {
        commentsList.innerHTML = '<p style="font-size:0.78rem;color:#9ca3af;">Sin comentarios todavía.</p>';
    } else {
        // Show newest first
        const sorted = [...comments].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        commentsList.innerHTML = sorted.map(c => {
            const d = c.createdAt ? new Date(c.createdAt) : null;
            const ts = d ? d.toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
            return `<div class="note-history-item">${c.text}<div class="note-history-ts">${ts}</div></div>`;
        }).join('');
    }
}

// ── Save grade ────────────────────────────────────────────────
document.getElementById('notes-save-grade-btn').addEventListener('click', async () => {
    if (!openStudentName) return;
    const key = studentKey(openStudentName);
    const btn = document.getElementById('notes-save-grade-btn');
    const savedMsg = document.getElementById('notes-grade-saved-msg');
    btn.disabled = true;
    try {
        await setDoc(doc(db, 'studentNotes', key), {
            name: openStudentName,
            grade: selectedGrade,
            gradeUpdatedAt: serverTimestamp()
        }, { merge: true });
        savedMsg.classList.add('show');
        setTimeout(() => savedMsg.classList.remove('show'), 2500);
    } catch (e) {
        console.error('Error saving grade:', e);
    } finally {
        btn.disabled = false;
    }
});

// ── Add comment ───────────────────────────────────────────────
document.getElementById('notes-add-comment-btn').addEventListener('click', async () => {
    if (!openStudentName) return;
    const key = studentKey(openStudentName);
    const text = document.getElementById('notes-textarea').value.trim();
    if (!text) return;
    const btn = document.getElementById('notes-add-comment-btn');
    const savedMsg = document.getElementById('notes-comment-saved-msg');
    btn.disabled = true;
    try {
        await setDoc(doc(db, 'studentNotes', key), {
            name: openStudentName,
            comments: arrayUnion({ text, createdAt: new Date().toISOString() })
        }, { merge: true });
        document.getElementById('notes-textarea').value = '';
        savedMsg.classList.add('show');
        setTimeout(() => savedMsg.classList.remove('show'), 2500);
    } catch (e) {
        console.error('Error adding comment:', e);
    } finally {
        btn.disabled = false;
    }
});
