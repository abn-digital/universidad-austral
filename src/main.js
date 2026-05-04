// Main Logic for Taller de IA Portal

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbz_XXXXXXXXX/exec'; // Reemplazar con tu URL de Apps Script

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('delivery-form');
    const adminTrigger = document.getElementById('admin-trigger');

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
                comision: document.getElementById('comision').value,
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                empresa: document.getElementById('empresa').value,
                url_web: document.getElementById('url-web').value,
                comments: document.getElementById('comentarios').value
            };

            try {
                // Simulación de envío (luego conectar con WEBHOOK_URL)
                console.log('Enviando datos:', data);
                
                // Opción real:
                // await fetch(WEBHOOK_URL, { method: 'POST', body: JSON.stringify(data) });

                setTimeout(() => {
                    alert('¡Entrega recibida correctamente, ' + data.nombre + '!');
                    form.reset();
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 1000);

            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un error al enviar. Por favor avisá por el grupo de WhatsApp.');
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    // Handle Admin Login
    adminTrigger.addEventListener('click', () => {
        const password = prompt('Admin Password:');
        if (password === 'hike2026') { // Contraseña simple para el demo
            showAdminPanel();
        } else {
            alert('Acceso denegado.');
        }
    });
});

function showAdminPanel() {
    // Crear un overlay para ver las entregas
    const overlay = document.createElement('div');
    overlay.style = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: var(--bg); z-index: 1000; padding: 4rem 2rem;
        overflow-y: auto;
    `;
    
    overlay.innerHTML = `
        <div class="container">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem;">
                <h2>Admin Dashboard <span>(Beta)</span></h2>
                <button id="close-admin" class="btn-primary">Cerrar</button>
            </div>
            <p style="margin-bottom: 2rem; color: var(--text-dim);">Aquí verás la lista de entregas de Google Sheets en tiempo real.</p>
            
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 1rem; overflow: hidden; border: 1px solid var(--border);">
                <thead>
                    <tr style="background: var(--dark); color: white; text-align: left;">
                        <th style="padding: 1rem;">Alumno</th>
                        <th style="padding: 1rem;">Empresa</th>
                        <th style="padding: 1rem;">Comisión</th>
                        <th style="padding: 1rem;">Link</th>
                    </tr>
                </thead>
                <tbody id="admin-table-body">
                    <tr>
                        <td colspan="4" style="padding: 3rem; text-align: center; color: var(--text-dim);">
                            Cargando datos desde Google Sheets...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('close-admin').onclick = () => overlay.remove();
}
