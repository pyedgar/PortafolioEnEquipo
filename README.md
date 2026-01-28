# Sistema de Gestión de Actividades

Este sistema permite gestionar las actividades del portafolio de evidencias de la materia Desarrollo Web Orientado a Servicios.

## Archivos principales

### datos.js
- Contiene datos iniciales de ejemplo
- Define la estructura de actividades, estudiantes y unidades
- Inicializa el localStorage con datos de ejemplo si está vacío

### actividades.js
- Sistema completo de gestión de actividades
- Permite crear, editar, eliminar y filtrar actividades
- Renderiza estadísticas y lista de actividades
- Maneja modales y notificaciones

### archivos.js
- Sistema de manejo de archivos
- Valida tipos y tamaños de archivos
- Muestra previsualización de archivos seleccionados
- Simula la subida de archivos

### app.js
- Script principal de la aplicación
- Configura navegación suave y eventos globales
- Inicializa todos los sistemas
- Funciones globales para llamadas desde HTML

## Funcionalidades principales

1. **Subir actividades**: Formulario completo con validación
2. **Filtros**: Por unidad, estado, tipo y búsqueda textual
3. **Ordenamiento**: Por fecha, nombre o unidad
4. **Estadísticas**: Muestra conteos de actividades por estado
5. **Gestión de archivos**: Validación y previsualización
6. **Responsive**: Funciona en dispositivos móviles y desktop
7. **Persistencia**: Datos guardados en localStorage

## Cómo usar

1. Haz clic en el botón flotante "+" para subir una nueva actividad
2. Completa el formulario con los datos de la actividad
3. Selecciona los archivos adjuntos (máximo 10MB por archivo)
4. Usa los filtros para encontrar actividades específicas
5. Haz clic en una actividad para ver sus detalles
6. Usa los botones de edición o eliminación para gestionar actividades

## Estructura de datos

Cada actividad tiene:
- ID único
- Título y descripción
- Unidad y tipo
- Estado y responsable
- Fechas de creación, entrega y revisión
- Archivos adjuntos y enlaces
- Calificación y observaciones

## Personalización

Para agregar más unidades, tipos o estados, modifica el archivo `datos.js`.
Para cambiar estilos, modifica los archivos CSS.