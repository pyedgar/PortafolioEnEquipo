// ============================================
// Sistema de Manejo de Archivos
// ============================================

class SistemaArchivos {
    constructor() {
        this.archivos = [];
        this.tiposPermitidos = [
            '.pdf', '.doc', '.docx', '.txt',
            '.jpg', '.jpeg', '.png', '.gif',
            '.zip', '.rar',
            '.js', '.html', '.css',
            '.ppt', '.pptx',
            '.xls', '.xlsx'
        ];
    }

    inicializar() {
        this.inicializarEventos();
    }

    inicializarEventos() {
        const inputArchivos = document.getElementById('activity-files');
        if (inputArchivos) {
            inputArchivos.addEventListener('change', this.previsualizarArchivos.bind(this));
        }
    }

    previsualizarArchivos(event) {
        const files = event.target.files;
        const preview = document.getElementById('file-preview');
        
        if (!preview) return;
        
        preview.innerHTML = '';
        
        if (files.length === 0) {
            preview.innerHTML = '<p class="text-muted small">No hay archivos seleccionados</p>';
            return;
        }

        let archivosValidos = true;
        let tamanioTotal = 0;
        const archivosProcesados = [];

        // Verificar cada archivo
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Verificar tipo de archivo
            const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            if (!this.tiposPermitidos.includes(extension)) {
                archivosValidos = false;
                this.mostrarError(`Tipo de archivo no permitido: ${file.name}`);
                continue;
            }

            // Verificar tamaño (10MB máximo)
            if (file.size > 10 * 1024 * 1024) {
                archivosValidos = false;
                this.mostrarError(`Archivo demasiado grande: ${file.name} (${this.formatearTamanio(file.size)})`);
                continue;
            }

            tamanioTotal += file.size;
            archivosProcesados.push(file);
            
            // Agregar a la previsualización
            preview.innerHTML += `
                <div class="file-preview-item d-flex align-items-center justify-content-between border rounded p-2 mb-2" data-file-name="${file.name}" data-file-size="${file.size}">
                    <div class="d-flex align-items-center">
                        <i class="bi ${this.obtenerIconoArchivo(extension)} me-2 text-primary"></i>
                        <div>
                            <small class="d-block">${file.name}</small>
                            <small class="text-muted">${this.formatearTamanio(file.size)}</small>
                        </div>
                    </div>
                    <div>
                        <button type="button" class="btn btn-sm btn-outline-danger" onclick="this.closest('.file-preview-item').remove()">
                            <i class="bi bi-x"></i>
                        </button>
                    </div>
                </div>
            `;
        }

        if (archivosProcesados.length > 0 && archivosValidos) {
            preview.innerHTML += `
                <div class="alert alert-success mt-2">
                    <i class="bi bi-check-circle me-2"></i>
                    ${archivosProcesados.length} archivo(s) seleccionado(s) - Total: ${this.formatearTamanio(tamanioTotal)}
                </div>
            `;
        }
    }

    obtenerIconoArchivo(extension) {
        const iconos = {
            '.pdf': 'bi-file-pdf',
            '.doc': 'bi-file-word',
            '.docx': 'bi-file-word',
            '.txt': 'bi-file-text',
            '.jpg': 'bi-file-image',
            '.jpeg': 'bi-file-image',
            '.png': 'bi-file-image',
            '.gif': 'bi-file-image',
            '.zip': 'bi-file-zip',
            '.rar': 'bi-file-zip',
            '.js': 'bi-file-code',
            '.html': 'bi-file-code',
            '.css': 'bi-file-code',
            '.ppt': 'bi-file-ppt',
            '.pptx': 'bi-file-ppt',
            '.xls': 'bi-file-excel',
            '.xlsx': 'bi-file-excel'
        };
        
        return iconos[extension] || 'bi-file-earmark';
    }

    formatearTamanio(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async procesarArchivo(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                const archivoData = {
                    nombre: file.name,
                    tipo: file.type,
                    tamaño: file.size,
                    datos: event.target.result,
                    extension: file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
                };
                resolve(archivoData);
            };
            
            reader.onerror = () => {
                reject(new Error('Error al leer el archivo'));
            };
            
            reader.readAsDataURL(file);
        });
    }

    async procesarArchivos(files) {
        const resultados = [];
        
        for (let i = 0; i < files.length; i++) {
            try {
                const archivoData = await this.procesarArchivo(files[i]);
                resultados.push(archivoData);
            } catch (error) {
                resultados.push({
                    nombre: files[i].name,
                    error: error.message,
                    éxito: false
                });
            }
        }
        
        return resultados;
    }

    descargarArchivo(nombreArchivo, datosBase64 = null) {
        try {
            if (!datosBase64) {
                // En una implementación real, aquí buscarías el archivo en el servidor
                // Por ahora, creamos un archivo de ejemplo
                const contenido = `Contenido del archivo: ${nombreArchivo}\n\nEste es un archivo de ejemplo para demostración.\nFecha de generación: ${new Date().toLocaleDateString()}`;
                const blob = new Blob([contenido], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                
                link.href = url;
                link.download = nombreArchivo;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                // Si hay datos base64, descargarlos
                const partes = datosBase64.split(',');
                const mime = partes[0].match(/:(.*?);/)[1];
                const b64 = partes[1];
                const byteCharacters = atob(b64);
                const byteNumbers = new Array(byteCharacters.length);
                
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: mime });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                
                link.href = url;
                link.download = nombreArchivo;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }
            
            this.mostrarNotificacion(`Descargando ${nombreArchivo}...`, 'success');
            return true;
            
        } catch (error) {
            console.error('Error al descargar archivo:', error);
            this.mostrarError(`Error al descargar ${nombreArchivo}: ${error.message}`);
            return false;
        }
    }

    mostrarError(mensaje) {
        this.mostrarNotificacion(mensaje, 'danger');
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
}

// Inicializar sistema de archivos
window.archivos = new SistemaArchivos();