// ============================================
// Script Principal de la Aplicación
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar datos
    if (typeof inicializarDatos === 'function') {
        inicializarDatos();
    }
    
    // Inicializar sistemas
    if (typeof actividades !== 'undefined') {
        actividades.inicializar();
    }
    
    if (typeof archivos !== 'undefined') {
        archivos.inicializar();
    }
    
    // Configurar navegación suave
    configurarNavegacion();
    
    // Configurar eventos globales
    configurarEventosGlobales();
    
    // Configurar validación de formularios
    configurarValidacionFormularios();
    
    // Agregar botón de exportación
    agregarBotonExportacion();
});

function configurarNavegacion() {
    // Navegación suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Cerrar navbar en móviles si está abierto
                const navbarCollapse = document.querySelector('.navbar-collapse.show');
                if (navbarCollapse) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }
                
                // Desplazamiento suave
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Actualizar navbar activo
                actualizarNavbarActivo(targetId);
            }
        });
    });
    
    // Actualizar navbar al hacer scroll
    window.addEventListener('scroll', actualizarNavbarScroll);
}

function actualizarNavbarActivo(targetId) {
    // Remover clase active de todos los enlaces
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Agregar clase active al enlace correspondiente
    const activeLink = document.querySelector(`.navbar-nav .nav-link[href="${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function actualizarNavbarScroll() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 100 && scrollY < sectionTop + sectionHeight - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function configurarEventosGlobales() {
    // Configurar tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Configurar fecha mínima para el input de fecha de entrega
    const fechaEntregaInput = document.getElementById('activity-due-date');
    if (fechaEntregaInput) {
        const fechaManana = new Date();
        fechaManana.setDate(fechaManana.getDate() + 1);
        fechaEntregaInput.min = fechaManana.toISOString().split('T')[0];
        
        // Establecer valor por defecto
        if (!fechaEntregaInput.value) {
            fechaEntregaInput.value = fechaManana.toISOString().split('T')[0];
        }
    }
    
    // Evento para cerrar modales con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
                const bsModal = bootstrap.Modal.getInstance(modal);
                if (bsModal) {
                    bsModal.hide();
                }
            });
        }
    });
}

function configurarValidacionFormularios() {
    // Validación de formularios
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
}

function agregarBotonExportacion() {
    // Crear botón de exportación
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn btn-success mt-3 d-block mx-auto';
    exportBtn.innerHTML = '<i class="bi bi-download me-2"></i>Exportar Reporte de Actividades';
    exportBtn.onclick = exportarReporteActividades;
    
    const actividadesContainer = document.querySelector('.activities-section .container');
    if (actividadesContainer) {
        actividadesContainer.appendChild(exportBtn);
    }
}

function exportarReporteActividades() {
    if (typeof actividades === 'undefined') {
        alert('Sistema de actividades no disponible');
        return;
    }
    
    // Crear contenido del reporte
    const contenido = generarContenidoReporte();
    
    // Crear y descargar archivo
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const fecha = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `reporte_actividades_${fecha}.txt`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    actividades.mostrarNotificacion('Reporte exportado correctamente', 'success');
}

function generarContenidoReporte() {
    let contenido = 'REPORTE DE ACTIVIDADES - PORTAFOLIO DWOS\n';
    contenido += '==========================================\n\n';
    
    contenido += `Fecha de generación: ${new Date().toLocaleDateString('es-MX', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}\n\n`;
    
    // Estadísticas
    const total = actividades.actividades.length;
    const entregadas = actividades.actividades.filter(a => a.estado === 'entregado' || a.estado === 'revisado').length;
    const pendientes = actividades.actividades.filter(a => a.estado === 'pendiente').length;
    const revisadas = actividades.actividades.filter(a => a.estado === 'revisado').length;
    
    contenido += 'ESTADÍSTICAS:\n';
    contenido += `Total de actividades: ${total}\n`;
    contenido += `Entregadas/Revisadas: ${entregadas}\n`;
    contenido += `Pendientes: ${pendientes}\n`;
    contenido += `Revisadas: ${revisadas}\n\n`;
    contenido += '==========================================\n\n';
    
    // Lista de actividades por unidad
    const actividadesPorUnidad = actividades.actividades.reduce((acc, actividad) => {
        const unidad = actividad.unidad;
        if (!acc[unidad]) acc[unidad] = [];
        acc[unidad].push(actividad);
        return acc;
    }, {});
    
    Object.keys(actividadesPorUnidad).sort().forEach(unidad => {
        const unidadInfo = window.datosActividades?.unidades[unidad];
        contenido += `UNIDAD ${unidad}: ${unidadInfo?.nombre || 'Sin nombre'}\n`;
        contenido += '-'.repeat(50) + '\n\n';
        
        actividadesPorUnidad[unidad].forEach((actividad, index) => {
            contenido += `${index + 1}. ${actividad.titulo}\n`;
            contenido += `   Estado: ${actividad.estado}\n`;
            contenido += `   Tipo: ${actividad.tipo}\n`;
            contenido += `   Responsable: ${actividad.responsable === 'ambos' ? 'Ambos' : 
                        actividad.responsable === 'edgar' ? 'Edgar Reyes' : 'Ramiro Alejandro'}\n`;
            contenido += `   Fecha de entrega: ${actividad.fechaEntrega}\n`;
            contenido += `   Archivos: ${actividad.archivos.join(', ') || 'Ninguno'}\n`;
            contenido += `   Descripción: ${actividad.descripcion.substring(0, 150)}...\n\n`;
        });
        
        contenido += '\n';
    });
    
    // Resumen por estudiante
    contenido += 'RESUMEN POR ESTUDIANTE:\n';
    contenido += '-'.repeat(50) + '\n\n';
    
    const estudiantes = ['edgar', 'ramiro'];
    estudiantes.forEach(estudiante => {
        const info = window.datosActividades?.estudiantes[estudiante];
        if (!info) return;
        
        const actividadesEstudiante = actividades.actividades.filter(a => 
            a.responsable === estudiante || a.responsable === 'ambos'
        );
        
        contenido += `${info.nombre}:\n`;
        contenido += `  Total actividades: ${actividadesEstudiante.length}\n`;
        contenido += `  Pendientes: ${actividadesEstudiante.filter(a => a.estado === 'pendiente').length}\n`;
        contenido += `  Entregadas: ${actividadesEstudiante.filter(a => a.estado === 'entregado').length}\n`;
        contenido += `  Revisadas: ${actividadesEstudiante.filter(a => a.estado === 'revisado').length}\n\n`;
    });
    
    return contenido;
}

// Funciones globales para llamadas desde HTML
function mostrarModalSubida() {
    if (typeof actividades !== 'undefined') {
        actividades.mostrarModalSubida();
    }
}

function subirActividad() {
    if (typeof actividades !== 'undefined') {
        actividades.subirActividad();
    }
}

function limpiarArchivos() {
    if (typeof actividades !== 'undefined') {
        actividades.limpiarArchivos();
    }
}

function aplicarFiltros() {
    if (typeof actividades !== 'undefined') {
        actividades.aplicarFiltros();
    }
}

// Hacer funciones disponibles globalmente
window.mostrarModalSubida = mostrarModalSubida;
window.subirActividad = subirActividad;
window.limpiarArchivos = limpiarArchivos;
window.aplicarFiltros = aplicarFiltros;
window.exportarReporteActividades = exportarReporteActividades;