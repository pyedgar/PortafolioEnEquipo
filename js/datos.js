// ============================================
// Datos iniciales para el sistema de actividades
// ============================================

const datosActividades = {
    actividades: [
        {
            id: 1,
            titulo: "Introducción a SOA",
            descripcion: "Investigación sobre los principios de la Arquitectura Orientada a Servicios y sus aplicaciones en el desarrollo web moderno.",
            unidad: "1",
            tipo: "teoria",
            estado: "revisado",
            responsable: "ambos",
            fechaCreacion: "2026-01-15",
            fechaEntrega: "2026-01-20",
            fechaRevisado: "2026-01-22",
            archivos: ["soa-research.pdf"],
            archivosBase64: [
                {
                    nombre: "soa-research.pdf",
                    datos: "data:application/pdf;base64,JVEhUTUwgVjUuMCBQREYtMS40CiUlQ3JlYXRvciBQREZMaWIgMS4wLjMKWyA8PDovVHlwZS9DYXRhbG9nL1BhZ2VzPDwvS2lkc1s8PDovVHlwZS9QYWdlL1BhcmVudCAxIDAgUi9Db250ZW50cyAyIDAgUi9NZWRpYUJveFswIDAgNTk1IDg0Ml0+Pj4+Pj4+CiAgICAgICA="
                }
            ],
            url: "",
            notas: "Excelente investigación, cubrió todos los puntos solicitados.",
            calificacion: 10
        },
        {
            id: 2,
            titulo: "Implementación API REST",
            descripcion: "Desarrollo de una API RESTful para gestión de usuarios utilizando Node.js y Express.",
            unidad: "2",
            tipo: "practica",
            estado: "entregado",
            responsable: "ramiro",
            fechaCreacion: "2026-01-25",
            fechaEntrega: "2026-02-05",
            fechaRevisado: null,
            archivos: ["api-rest.zip", "documentacion.pdf"],
            archivosBase64: [
                {
                    nombre: "documentacion.pdf",
                    datos: "data:application/pdf;base64,JVEhUTUwgVjUuMCBQREYtMS40CiUlQ3JlYXRvciBQREZMaWIgMS4wLjMKWyA8PDovVHlwZS9DYXRhbG9nL1BhZ2VzPDwvS2lkc1s8PDovVHlwZS9QYWdlL1BhcmVudCAxIDAgUi9Db250ZW50cyAyIDAgUi9NZWRpYUJveFswIDAgNTk1IDg0Ml0+Pj4+Pj4+CiAgICAgICA="
                }
            ],
            url: "https://github.com/ramiro/api-rest-demo",
            notas: "Implementación completa con autenticación JWT y documentación Swagger.",
            calificacion: null
        },
        {
            id: 3,
            titulo: "Geolocalización con Google Maps API",
            descripcion: "Integración de la API de Google Maps en una aplicación web para mostrar ubicaciones.",
            unidad: "2",
            tipo: "practica",
            estado: "pendiente",
            responsable: "edgar",
            fechaCreacion: "2026-01-28",
            fechaEntrega: "2026-02-10",
            fechaRevisado: null,
            archivos: ["geolocalizacion.html", "styles.css", "mapa.js"],
            archivosBase64: [
                {
                    nombre: "geolocalizacion.html",
                    datos: "data:text/html;base64,PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVzIj4KPGhlYWQ+CiAgICA8dGl0bGU+R2VvbG9jYWxpemFjacOzbjwvdGl0bGU+CiAgICA8bWV0YSBjaGFyc2V0PSJVVEYtOCI+CiAgICA8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMCI+CiAgICA8c2NyaXB0IHNyYz0iaHR0cHM6Ly9tYXBzLmFwaS5nb29nbGUuY29tL21hcHMvYXBpL2pzIj48L3NjcmlwdD4KPC9oZWFkPgo8Ym9keT4KICAgIDxoMT5HZW9sb2NhbGl6YWNpw7NuIGNvbiBHb29nbGUgTWFwczwvaDE+CiAgICA8ZGl2IGlkPSJtYXAiIHN0eWxlPSJ3aWR0aDoxMDAlOyBoZWlnaHQ6NDAwcHg7Ij48L2Rpdj4KICAgIDxzY3JpcHQ+CiAgICAgICAgZnVuY3Rpb24gaW5pdE1hcCgpIHsKICAgICAgICAgICAgY29uc3QgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgibWFwIiksIHsKICAgICAgICAgICAgICAgIGNlbnRlcjoge2xhdDogLTM0LjYwMzcsIGxuZzogLTU4LjM4MTZ9LAogICAgICAgICAgICAgICAgem9vbTogMTUKICAgICAgICAgICAgfSk7CiAgICAgICAgfQogICAgICAgIHdpbmRvdy5vbmxvYWQgPSBpbml0TWFwOwogICAgPC9zY3JpcHQ+CjwvYm9keT4KPC9odG1sPg=="
                },
                {
                    nombre: "styles.css",
                    datos: "data:text/css;base64,Ym9keSB7CiAgICBmb250LWZhbWlseTogQXJpYWwsIHNhbnMtc2VyaWY7CiAgICBtYXJnaW46IDA7CiAgICBwYWRkaW5nOiAyMHB4Owp9CgpoMSB7CiAgICBjb2xvcjogIzMzMzsKICAgIHRleHQtYWxpZ246IGNlbnRlcjsKfQ=="
                },
                {
                    nombre: "mapa.js",
                    datos: "data:application/javascript;base64,ZnVuY3Rpb24gaW5pdE1hcCgpIHsKICAgIGNvbnN0IG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIm1hcCIpLCB7CiAgICAgICAgY2VudGVyOiB7bGF0OiAtMzQuNjAzNywgbG5nOiAtNTguMzgxNn0sCiAgICAgICAgem9vbTogMTUKICAgIH0pOwoKICAgIGNvbnN0IG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoewogICAgICAgIHBvc2l0aW9uOiB7bGF0OiAtMzQuNjAzNywgbG5nOiAtNTguMzgxNn0sCiAgICAgICAgbWFwOiBtYXAsCiAgICAgICAgdGl0bGU6ICJNaeFzIENpdHkhIgogICAgfSk7Cn0K"
                }
            ],
            url: "",
            notas: "En desarrollo",
            calificacion: null
        }
    ],

    estudiantes: {
        edgar: {
            nombre: "Edgar Reyes de la Cruz",
            id: "20261234",
            email: "24040044@alumno.utc.edu.mx",
            avatar: "assets/images/edgar.jpg",
            habilidades: ["HTML/CSS", "JavaScript", "Bootstrap", "React", "Diseño UI/UX"]
        },
        ramiro: {
            nombre: "Ramiro Alejandro",
            id: "20265678",
            email: "24040004@alumno.utc.edu.mx",
            avatar: "assets/images/ramiro.jpg",
            habilidades: ["Node.js", "Express", "MongoDB", "API REST", "Git"]
        }
    },

    unidades: {
        "1": {
            nombre: "Unidad 1 - Introducción al Desarrollo Web Orientado a Servicios",
            temas: [
                "Paradigma del desarrollo de aplicaciones orientadas a servicios",
                "Arquitectura Orientada a Servicios (SOA)",
                "Servicios en la nube (SaaS, PaaS, IaaS)",
                "Aplicaciones web híbridas (Mashup)"
            ],
            responsable: "ambos"
        },
        "2": {
            nombre: "Unidad 2 - Implementación de Interfaz de Programación de Aplicaciones (API)",
            temas: [
                "Geolocalización",
                "Redes Sociales",
                "Bases de Datos",
                "Plataformas On-Line",
                "Plataformas Streaming"
            ],
            responsable: "ramiro"
        },
        "3": {
            nombre: "Unidad 3 - Desarrollo de una Interfaz de Programación de Aplicaciones (API)",
            temas: [
                "Diseño de APIs RESTful",
                "Documentación con Swagger/OpenAPI",
                "Autenticación y autorización",
                "Versionado de APIs",
                "Pruebas de APIs"
            ],
            responsable: "ramiro"
        },
        "4": {
            nombre: "Unidad 4 - Implementación",
            temas: [
                "Despliegue en servidores web",
                "Configuración de dominios y SSL",
                "Monitoreo y logs",
                "Escalabilidad y balanceo de carga",
                "Backup y recuperación"
            ],
            responsable: "edgar"
        }
    },

    tiposActividad: {
        teoria: {
            nombre: "Teoría / Documentación",
            icono: "bi-book",
            color: "info"
        },
        practica: {
            nombre: "Práctica / Ejercicio",
            icono: "bi-code-slash",
            color: "success"
        },
        evidencia: {
            nombre: "Evidencia / Capturas",
            icono: "bi-camera",
            color: "warning"
        },
        "saber-hacer": {
            nombre: "Saber Hacer",
            icono: "bi-gear",
            color: "primary"
        },
        proyecto: {
            nombre: "Proyecto",
            icono: "bi-rocket-takeoff",
            color: "danger"
        }
    },

    estadosActividad: {
        pendiente: {
            nombre: "Pendiente",
            icono: "bi-clock",
            color: "warning",
            badge: "warning"
        },
        entregado: {
            nombre: "Entregado",
            icono: "bi-check-circle",
            color: "info",
            badge: "info"
        },
        vencido: {
            nombre: "Vencido",
            icono: "bi-exclamation-circle",
            color: "danger",
            badge: "danger"
        },
        revisado: {
            nombre: "Revisado",
            icono: "bi-star-fill",
            color: "success",
            badge: "success"
        }
    }
};

// Función para inicializar datos en localStorage si no existen
function inicializarDatos() {
    if (!localStorage.getItem('actividades')) {
        localStorage.setItem('actividades', JSON.stringify(datosActividades.actividades));
    }
    
    if (!localStorage.getItem('contadorId')) {
        localStorage.setItem('contadorId', '3'); // Empezamos desde 3 porque ya tenemos 3 actividades
    }
}

// Exportar datos al ámbito global
window.datosActividades = datosActividades;
window.inicializarDatos = inicializarDatos;