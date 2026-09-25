// Helpers para interpolar datos cargados por alumnos dentro de innerHTML.

export function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Devuelve la URL solo si es http(s), para no renderizar links `javascript:`.
export function safeUrl(value) {
    const url = String(value ?? '').trim();
    return /^https?:\/\//i.test(url) ? url : null;
}
