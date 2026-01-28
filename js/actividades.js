// ============================================
// Sistema de Gestión de Actividades (Completamente Funcional)
// ============================================

class SistemaActividades {
    constructor() {
        this.actividades = [];
        this.filtroUnidad = 'todas';
        this.filtroEstado = 'todos';
        this.filtroTipo = 'todos';
        this.orden = 'fecha-reciente';
        this.busqueda = '';
        this.actividadEditando = null;
    }

    inicializar() {
        this.cargarActividades();
        this.renderizarEstadisticas();
        this.renderizarActividades();
        this.inicializarEventos();
    }

    cargarActividades() {
        const actividadesGuardadas = localStorage.getItem('actividades');
        if (actividadesGuardadas) {
            this.actividades = JSON.parse(actividadesGuardadas);
        } else {
            this.actividades = window.datosActividades?.actividades || [];
            this.guardarActividades();
        }
    }

    guardarActividades() {
        localStorage.setItem('actividades', JSON.stringify(this.actividades));
    }

    obtenerProximoId() {
        let contador = parseInt(localStorage.getItem('contadorId') || '3');
        contador++;
        localStorage.setItem('contadorId', contador.toString());
        return contador;
    }

    inicializarEventos() {
        // Eventos de filtros
        document.getElementById('filter-unit')?.addEventListener('change', (e) => {
            this.filtroUnidad = e.target.value;
            this.renderizarActividades();
        });

        document.getElementById('filter-status')?.addEventListener('change', (e) => {
            this.filtroEstado = e.target.value;
            this.renderizarActividades();
        });

        document.getElementById('filter-type')?.addEventListener('change', (e) => {
            this.filtroTipo = e.target.value;
            this.renderizarActividades();
        });

        document.getElementById('filter-sort')?.addEventListener('change', (e) => {
            this.orden = e.target.value;
            this.renderizarActividades();
        });

        // Evento de búsqueda
        document.getElementById('search-activities')?.addEventListener('input', (e) => {
            this.busqueda = e.target.value.toLowerCase();
            this.renderizarActividades();
        });

        // Evento del botón flotante
        document.querySelector('.upload-btn')?.addEventListener('click', this.mostrarModalSubida.bind(this));

        // Evento para el formulario de subida
        const uploadForm = document.getElementById('uploadForm');
        if (uploadForm) {
            uploadForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.subirActividad();
            });
        }
    }

    mostrarModalSubida() {
        const modalElement = document.getElementById('uploadModal');
        if (!modalElement) return;
        
        const modal = new bootstrap.Modal(modalElement);
        this.limpiarFormulario();
        document.getElementById('activity-due-date').value = this.obtenerFechaManana();
        this.actividadEditando = null;
        document.getElementById('uploadModalLabel').innerHTML = `
            <i class="bi bi-cloud-upload me-2"></i>Subir Nueva Actividad
        `;
        modal.show();
    }

    limpiarFormulario() {
        const form = document.getElementById('uploadForm');
        if (form) {
            form.reset();
            const filePreview = document.getElementById('file-preview');
            if (filePreview) {
                filePreview.innerHTML = '';
            }
        }
    }

    obtenerFechaManana() {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + 1);
        return fecha.toISOString().split('T')[0];
    }

    obtenerActividadesFiltradas() {
        let actividadesFiltradas = [...this.actividades];

        // Aplicar filtros
        if (this.filtroUnidad !== 'todas') {
            actividadesFiltradas = actividadesFiltradas.filter(a => a.unidad === this.filtroUnidad);
        }

        if (this.filtroEstado !== 'todos') {
            actividadesFiltradas = actividadesFiltradas.filter(a => a.estado === this.filtroEstado);
        }

        if (this.filtroTipo !== 'todos') {
            actividadesFiltradas = actividadesFiltradas.filter(a => a.tipo === this.filtroTipo);
        }

        // Aplicar búsqueda
        if (this.busqueda) {
            actividadesFiltradas = actividadesFiltradas.filter(a => 
                a.titulo.toLowerCase().includes(this.busqueda) ||
                a.descripcion.toLowerCase().includes(this.busqueda) ||
                a.archivos.some(archivo => archivo.toLowerCase().includes(this.busqueda))
            );
        }

        // Aplicar orden
        actividadesFiltradas.sort((a, b) => {
            switch (this.orden) {
                case 'fecha-reciente':
                    return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
                case 'fecha-antigua':
                    return new Date(a.fechaCreacion) - new Date(b.fechaCreacion);
                case 'nombre-asc':
                    return a.titulo.localeCompare(b.titulo);
                case 'nombre-desc':
                    return b.titulo.localeCompare(a.titulo);
                case 'unidad':
                    return a.unidad.localeCompare(b.unidad);
                default:
                    return 0;
            }
        });

        return actividadesFiltradas;
    }

    renderizarEstadisticas() {
        const contenedor = document.getElementById('estadisticas-container');
        if (!contenedor) return;

        const total = this.actividades.length;
        const entregadas = this.actividades.filter(a => a.estado === 'entregado' || a.estado === 'revisado').length;
        const pendientes = this.actividades.filter(a => a.estado === 'pendiente').length;
        const vencidas = this.actividades.filter(a => a.estado === 'vencido').length;
        const revisadas = this.actividades.filter(a => a.estado === 'revisado').length;

        contenedor.innerHTML = `
            <div class="col-md-3 col-6">
                <div class="stats-card total">
                    <i class="bi bi-folder me-2"></i>
                    <div>
                        <h3>${total}</h3>
                        <p>Total Actividades</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-6">
                <div class="stats-card entregadas">
                    <i class="bi bi-check-circle me-2"></i>
                    <div>
                        <h3>${entregadas}</h3>
                        <p>Entregadas</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-6">
                <div class="stats-card pendientes">
                    <i class="bi bi-clock me-2"></i>
                    <div>
                        <h3>${pendientes}</h3>
                        <p>Pendientes</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-6">
                <div class="stats-card revisadas">
                    <i class="bi bi-star-fill me-2"></i>
                    <div>
                        <h3>${revisadas}</h3>
                        <p>Revisadas</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderizarActividades() {
        const contenedor = document.getElementById('activities-list');
        if (!contenedor) return;

        const actividadesFiltradas = this.obtenerActividadesFiltradas();

        if (actividadesFiltradas.length === 0) {
            contenedor.innerHTML = `
                <div class="no-activities text-center py-5">
                    <i class="bi bi-inbox display-1 text-muted mb-3"></i>
                    <h4 class="text-muted">No se encontraron actividades</h4>
                    <p class="text-muted">Intenta cambiar los filtros de búsqueda o sube una nueva actividad.</p>
                    <button class="btn btn-primary mt-3" onclick="actividades.mostrarModalSubida()">
                        <i class="bi bi-plus-lg me-2"></i>Subir Nueva Actividad
                    </button>
                </div>
            `;
            return;
        }

        contenedor.innerHTML = actividadesFiltradas.map(actividad => {
            const tipoInfo = window.datosActividades?.tiposActividad[actividad.tipo] || { nombre: actividad.tipo, icono: 'bi-file', color: 'secondary' };
            const estadoInfo = window.datosActividades?.estadosActividad[actividad.estado] || { nombre: actividad.estado, icono: 'bi-circle', color: 'secondary', badge: 'secondary' };
            const unidadInfo = window.datosActividades?.unidades[actividad.unidad] || { nombre: `Unidad ${actividad.unidad}` };

            let responsableNombre = "Ambos";
            if (actividad.responsable === 'edgar') {
                responsableNombre = window.datosActividades?.estudiantes.edgar.nombre || "Edgar Reyes";
            } else if (actividad.responsable === 'ramiro') {
                responsableNombre = window.datosActividades?.estudiantes.ramiro.nombre || "Ramiro Alejandro";
            }

            const fechaEntrega = new Date(actividad.fechaEntrega);
            const fechaActual = new Date();
            const diasRestantes = Math.ceil((fechaEntrega - fechaActual) / (1000 * 60 * 60 * 24));
            let alertaTiempo = '';
            
            if (actividad.estado === 'pendiente') {
                if (diasRestantes < 0) {
                    alertaTiempo = '<span class="badge bg-danger">¡Vencido!</span>';
                } else if (diasRestantes <= 2) {
                    alertaTiempo = `<span class="badge bg-warning">${diasRestantes} día(s) restante(s)</span>`;
                } else if (diasRestantes <= 7) {
                    alertaTiempo = `<span class="badge bg-info">${diasRestantes} día(s) restante(s)</span>`;
                }
            }

            return `
                <div class="activity-card" data-id="${actividad.id}">
                    <div class="activity-header">
                        <div class="activity-title-section">
                            <h5 class="activity-title">${actividad.titulo}</h5>
                            <div class="activity-meta">
                                <span class="badge bg-${tipoInfo.color}">
                                    <i class="bi ${tipoInfo.icono} me-1"></i>${tipoInfo.nombre}
                                </span>
                                <span class="badge bg-${estadoInfo.badge}">
                                    <i class="bi ${estadoInfo.icono} me-1"></i>${estadoInfo.nombre}
                                </span>
                                <span class="badge bg-secondary">
                                    <i class="bi bi-journal me-1"></i>${unidadInfo.nombre.split(' - ')[0]}
                                </span>
                                ${alertaTiempo}
                            </div>
                        </div>
                        <div class="activity-actions">
                            <button class="btn btn-sm btn-outline-primary" onclick="actividades.verDetalles(${actividad.id})" title="Ver detalles">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-warning" onclick="actividades.editarActividad(${actividad.id})" title="Editar">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="actividades.eliminarActividad(${actividad.id})" title="Eliminar">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="activity-body">
                        <p class="activity-description">${actividad.descripcion}</p>
                        
                        <div class="row mt-3">
                            <div class="col-md-6">
                                <div class="activity-info">
                                    <strong><i class="bi bi-calendar me-2"></i>Fecha de entrega:</strong>
                                    ${new Date(actividad.fechaEntrega).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                                <div class="activity-info">
                                    <strong><i class="bi bi-person me-2"></i>Responsable:</strong>
                                    ${responsableNombre}
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="activity-info">
                                    <strong><i class="bi bi-paperclip me-2"></i>Archivos:</strong>
                                    ${actividad.archivos.length} archivo(s)
                                    ${actividad.archivos.length > 0 ? 
                                        `<button class="btn btn-sm btn-outline-success ms-2" onclick="actividades.descargarTodosArchivos(${actividad.id})" title="Descargar todos los archivos">
                                            <i class="bi bi-download"></i> Todos
                                        </button>` : 
                                        ''}
                                </div>
                                ${actividad.calificacion ? `
                                    <div class="activity-info">
                                        <strong><i class="bi bi-star-fill me-2 text-warning"></i>Calificación:</strong>
                                        <span class="badge bg-success">${actividad.calificacion}/10</span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        ${actividad.archivos.length > 0 ? `
                            <div class="activity-files mt-3">
                                <strong><i class="bi bi-files me-2"></i>Archivos adjuntos:</strong>
                                <div class="file-list mt-1">
                                    ${actividad.archivos.map(archivo => `
                                        <span class="badge bg-light text-dark file-badge">
                                            <i class="bi bi-file-earmark me-1"></i>${archivo}
                                            <button class="btn btn-sm btn-link p-0 ms-1" onclick="actividades.descargarArchivo(${actividad.id}, '${archivo.replace(/'/g, "\\'")}')" title="Descargar">
                                                <i class="bi bi-download text-primary"></i>
                                            </button>
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        ${actividad.url ? `
                            <div class="activity-url mt-2">
                                <strong><i class="bi bi-link me-2"></i>Enlace:</strong>
                                <a href="${actividad.url}" target="_blank" class="text-decoration-none">
                                    ${actividad.url}
                                </a>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="activity-footer">
                        <small class="text-muted">
                            <i class="bi bi-clock me-1"></i>
                            Creada: ${new Date(actividad.fechaCreacion).toLocaleDateString('es-MX')}
                            ${actividad.fechaRevisado ? 
                                ` | Revisada: ${new Date(actividad.fechaRevisado).toLocaleDateString('es-MX')}` : 
                                ''}
                        </small>
                    </div>
                </div>
            `;
        }).join('');
    }

    async subirActividad() {
        const form = document.getElementById('uploadForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            this.mostrarNotificacion('Por favor, completa todos los campos requeridos', 'warning');
            return;
        }

        // Procesar archivos si hay alguno
        const inputArchivos = document.getElementById('activity-files');
        let archivosProcesados = [];
        let archivosBase64 = [];

        if (inputArchivos.files.length > 0) {
            try {
                // Procesar archivos
                const resultados = await archivos.procesarArchivos(inputArchivos.files);
                archivosProcesados = resultados.filter(r => !r.error).map(r => r.nombre);
                archivosBase64 = resultados.filter(r => !r.error).map(r => ({
                    nombre: r.nombre,
                    datos: r.datos
                }));

            } catch (error) {
                this.mostrarNotificacion('Error al procesar archivos: ' + error.message, 'error');
                return;
            }
        }

        const actividadData = {
            id: this.actividadEditando ? this.actividadEditando.id : this.obtenerProximoId(),
            titulo: document.getElementById('activity-title').value,
            descripcion: document.getElementById('activity-description').value,
            unidad: document.getElementById('activity-unit').value,
            tipo: document.getElementById('activity-type').value,
            estado: document.getElementById('activity-status').value,
            responsable: document.getElementById('activity-responsible').value,
            fechaCreacion: this.actividadEditando ? this.actividadEditando.fechaCreacion : new Date().toISOString().split('T')[0],
            fechaEntrega: document.getElementById('activity-due-date').value,
            fechaRevisado: null,
            archivos: archivosProcesados,
            archivosBase64: archivosBase64,
            url: document.getElementById('activity-url').value || '',
            notas: document.getElementById('activity-notes').value || '',
            calificacion: null
        };

        if (this.actividadEditando) {
            // Actualizar actividad existente
            const index = this.actividades.findIndex(a => a.id === this.actividadEditando.id);
            if (index !== -1) {
                // Combinar archivos existentes con nuevos
                const archivosExistentes = this.actividades[index].archivos || [];
                const archivosBase64Existentes = this.actividades[index].archivosBase64 || [];
                
                actividadData.archivos = [...archivosExistentes, ...archivosProcesados];
                actividadData.archivosBase64 = [...archivosBase64Existentes, ...archivosBase64];
                
                this.actividades[index] = actividadData;
                this.mostrarNotificacion('Actividad actualizada correctamente', 'success');
            }
        } else {
            // Agregar nueva actividad
            this.actividades.push(actividadData);
            this.mostrarNotificacion('Actividad subida correctamente', 'success');
        }

        this.guardarActividades();
        this.renderizarEstadisticas();
        this.renderizarActividades();

        // Cerrar modal
        const modalElement = document.getElementById('uploadModal');
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
        }

        // Notificar al profesor si está marcado
        const notifyCheckbox = document.getElementById('notify-teacher');
        if (notifyCheckbox && notifyCheckbox.checked) {
            this.mostrarNotificacion('Se ha notificado al profesor sobre esta entrega', 'info');
        }

        this.actividadEditando = null;
        this.limpiarFormulario();
    }

    verDetalles(id) {
        const actividad = this.actividades.find(a => a.id === id);
        if (!actividad) {
            this.mostrarNotificacion('Actividad no encontrada', 'error');
            return;
        }

        const tipoInfo = window.datosActividades?.tiposActividad[actividad.tipo] || { nombre: actividad.tipo };
        const estadoInfo = window.datosActividades?.estadosActividad[actividad.estado] || { nombre: actividad.estado };
        const unidadInfo = window.datosActividades?.unidades[actividad.unidad] || { nombre: `Unidad ${actividad.unidad}` };

        let responsableNombre = "Ambos (Trabajo en equipo)";
        let responsableInfo = "";
        if (actividad.responsable === 'edgar') {
            const estudiante = window.datosActividades?.estudiantes.edgar;
            responsableNombre = estudiante.nombre;
            responsableInfo = `ID: ${estudiante.id} | Email: ${estudiante.email}`;
        } else if (actividad.responsable === 'ramiro') {
            const estudiante = window.datosActividades?.estudiantes.ramiro;
            responsableNombre = estudiante.nombre;
            responsableInfo = `ID: ${estudiante.id} | Email: ${estudiante.email}`;
        }

        const detalles = `
            <div class="activity-detail">
                <div class="detail-header mb-4">
                    <h4 class="text-primary">${actividad.titulo}</h4>
                    <div class="badges mb-2">
                        <span class="badge bg-${tipoInfo.color} me-2">
                            <i class="bi ${tipoInfo.icono} me-1"></i>${tipoInfo.nombre}
                        </span>
                        <span class="badge bg-${estadoInfo.badge} me-2">
                            <i class="bi ${estadoInfo.icono} me-1"></i>${estadoInfo.nombre}
                        </span>
                        <span class="badge bg-secondary">
                            <i class="bi bi-journal me-1"></i>${unidadInfo.nombre}
                        </span>
                    </div>
                </div>

                <div class="detail-section mb-4">
                    <h5><i class="bi bi-card-text me-2"></i>Descripción</h5>
                    <p>${actividad.descripcion}</p>
                </div>

                <div class="row mb-4">
                    <div class="col-md-6">
                        <div class="detail-section">
                            <h5><i class="bi bi-calendar-event me-2"></i>Fechas</h5>
                            <ul class="list-unstyled">
                                <li class="mb-2"><strong>Fecha de creación:</strong> ${new Date(actividad.fechaCreacion).toLocaleDateString('es-MX', { dateStyle: 'full' })}</li>
                                <li class="mb-2"><strong>Fecha de entrega:</strong> ${new Date(actividad.fechaEntrega).toLocaleDateString('es-MX', { dateStyle: 'full' })}</li>
                                ${actividad.fechaRevisado ? `
                                    <li class="mb-2"><strong>Fecha de revisión:</strong> ${new Date(actividad.fechaRevisado).toLocaleDateString('es-MX', { dateStyle: 'full' })}</li>
                                ` : ''}
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="detail-section">
                            <h5><i class="bi bi-person-badge me-2"></i>Responsable</h5>
                            <p class="mb-1"><strong>${responsableNombre}</strong></p>
                            <p class="text-muted small mb-2">${responsableInfo}</p>
                            ${actividad.calificacion ? `
                                <div class="mt-3">
                                    <h5><i class="bi bi-star-fill text-warning me-2"></i>Calificación</h5>
                                    <div class="calificacion-display">
                                        <span class="badge bg-success fs-5">${actividad.calificacion}/10</span>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>

                ${actividad.archivos.length > 0 ? `
                    <div class="detail-section mb-4">
                        <h5><i class="bi bi-paperclip me-2"></i>Archivos Adjuntos (${actividad.archivos.length})</h5>
                        <div class="list-group">
                            ${actividad.archivos.map(archivo => {
                                const archivoBase64 = actividad.archivosBase64?.find(a => a.nombre === archivo);
                                return `
                                <div class="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <i class="bi bi-file-earmark me-2"></i>
                                        ${archivo}
                                    </div>
                                    <div>
                                        <button class="btn btn-sm btn-outline-primary" onclick="actividades.descargarArchivo(${actividad.id}, '${archivo.replace(/'/g, "\\'")}')">
                                            <i class="bi bi-download"></i> Descargar
                                        </button>
                                    </div>
                                </div>
                            `}).join('')}
                            ${actividad.archivos.length > 1 ? `
                                <div class="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <i class="bi bi-files me-2"></i>
                                        <strong>Todos los archivos</strong>
                                    </div>
                                    <button class="btn btn-sm btn-outline-success" onclick="actividades.descargarTodosArchivos(${actividad.id})">
                                        <i class="bi bi-download"></i> Descargar todos
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}

                ${actividad.url ? `
                    <div class="detail-section mb-4">
                        <h5><i class="bi bi-link me-2"></i>Enlace Externo</h5>
                        <a href="${actividad.url}" target="_blank" class="btn btn-outline-primary">
                            <i class="bi bi-box-arrow-up-right me-2"></i>Abrir enlace
                        </a>
                    </div>
                ` : ''}

                ${actividad.notas ? `
                    <div class="detail-section mb-4">
                        <h5><i class="bi bi-chat-left-text me-2"></i>Observaciones</h5>
                        <div class="alert alert-light">
                            ${actividad.notas}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        const detailContent = document.getElementById('activity-detail-content');
        if (detailContent) {
            detailContent.innerHTML = detalles;
            const modalElement = document.getElementById('activityDetailModal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
            }
        }
    }

    editarActividad(id) {
        const actividad = this.actividades.find(a => a.id === id);
        if (!actividad) {
            this.mostrarNotificacion('Actividad no encontrada', 'error');
            return;
        }

        this.actividadEditando = actividad;

        // Llenar el formulario
        document.getElementById('activity-title').value = actividad.titulo;
        document.getElementById('activity-description').value = actividad.descripcion;
        document.getElementById('activity-unit').value = actividad.unidad;
        document.getElementById('activity-type').value = actividad.tipo;
        document.getElementById('activity-status').value = actividad.estado;
        document.getElementById('activity-due-date').value = actividad.fechaEntrega;
        document.getElementById('activity-responsible').value = actividad.responsable;
        document.getElementById('activity-url').value = actividad.url || '';
        document.getElementById('activity-notes').value = actividad.notas || '';
        document.getElementById('notify-teacher').checked = false;

        // Mostrar nombres de archivos existentes
        const filePreview = document.getElementById('file-preview');
        if (filePreview && actividad.archivos.length > 0) {
            filePreview.innerHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    Esta actividad ya tiene ${actividad.archivos.length} archivo(s) adjunto(s). 
                    Si subes nuevos archivos, se añadirán a los existentes.
                </div>
                ${actividad.archivos.map(archivo => `
                    <div class="file-preview-item d-flex align-items-center justify-content-between border rounded p-2 mb-2">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-file-earmark me-2 text-secondary"></i>
                            <div>
                                <small class="d-block">${archivo} (existente)</small>
                            </div>
                        </div>
                    </div>
                `).join('')}
            `;
        }

        // Mostrar modal
        const modalElement = document.getElementById('uploadModal');
        if (modalElement) {
            document.getElementById('uploadModalLabel').innerHTML = `
                <i class="bi bi-pencil-square me-2"></i>Editar Actividad
            `;
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    }

    eliminarActividad(id) {
        if (!confirm('¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer.')) {
            return;
        }

        const actividad = this.actividades.find(a => a.id === id);
        if (!actividad) {
            this.mostrarNotificacion('Actividad no encontrada', 'error');
            return;
        }

        // Eliminar la actividad
        this.actividades = this.actividades.filter(a => a.id !== id);
        this.guardarActividades();
        this.renderizarEstadisticas();
        this.renderizarActividades();
        
        this.mostrarNotificacion('Actividad eliminada correctamente', 'success');
    }

    descargarArchivo(idActividad, nombreArchivo) {
        const actividad = this.actividades.find(a => a.id === idActividad);
        if (!actividad) {
            this.mostrarNotificacion('Actividad no encontrada', 'error');
            return;
        }

        const archivoBase64 = actividad.archivosBase64?.find(a => a.nombre === nombreArchivo);
        if (archivoBase64) {
            archivos.descargarArchivo(nombreArchivo, archivoBase64.datos);
        } else {
            // Si no hay datos base64, descargar archivo de ejemplo
            archivos.descargarArchivo(nombreArchivo);
        }
    }

    descargarTodosArchivos(idActividad) {
        const actividad = this.actividades.find(a => a.id === idActividad);
        if (!actividad || !actividad.archivosBase64 || actividad.archivosBase64.length === 0) {
            this.mostrarNotificacion('No hay archivos para descargar', 'warning');
            return;
        }

        // Descargar cada archivo con un pequeño retraso entre ellos
        actividad.archivosBase64.forEach((archivo, index) => {
            setTimeout(() => {
                archivos.descargarArchivo(archivo.nombre, archivo.datos);
            }, index * 500);
        });
        
        this.mostrarNotificacion(`Iniciando descarga de ${actividad.archivosBase64.length} archivo(s)...`, 'info');
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        const toastHTML = `
            <div class="toast align-items-center text-bg-${tipo} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="bi ${tipo === 'success' ? 'bi-check-circle' : tipo === 'error' ? 'bi-exclamation-circle' : 'bi-info-circle'} me-2"></i>
                        ${mensaje}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;

        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }

        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        const toastElement = toastContainer.lastElementChild;
        const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
        toast.show();

        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    aplicarFiltros() {
        this.filtroUnidad = document.getElementById('filter-unit').value;
        this.filtroEstado = document.getElementById('filter-status').value;
        this.filtroTipo = document.getElementById('filter-type').value;
        this.orden = document.getElementById('filter-sort').value;
        this.renderizarActividades();
        this.mostrarNotificacion('Filtros aplicados correctamente', 'info');
    }

    limpiarArchivos() {
        document.getElementById('activity-files').value = '';
        const filePreview = document.getElementById('file-preview');
        if (filePreview) {
            filePreview.innerHTML = '';
        }
    }
}

// Inicializar sistema de actividades
window.actividades = new SistemaActividades();