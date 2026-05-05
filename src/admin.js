import { auth, db } from './firebase.js';
import {
    collection, onSnapshot, query, orderBy
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

// ── State ─────────────────────────────────────────────────────
let attendance = [];
let submissions = [];
let activeClass = 'clase-1';
let activeCom = 'all';
let activeSubCom = 'all';

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
        });
        onSnapshot(query(collection(db, 'submissions'), orderBy('timestamp', 'desc')), snap => {
            submissions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            renderSubmissions();
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

    // Scorecards
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

    // Table rows
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

    // Scorecards
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
            `<a href="${l}" target="_blank" class="link-item">🔗 ${l}</a>`).join('') || '<span style="color:#999;font-size:0.8rem;">Sin links</span>';

        const chips = (s.integrantes || []).map(i => `<span class="chip">${i.nombre}</span>`).join('');

        const filesHTML = (s.adjuntos || []).map(a => {
            const isImage = /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(a.nombre);
            return `
                <a href="${a.url}" target="_blank" class="file-chip">📎 ${a.nombre}</a>
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
