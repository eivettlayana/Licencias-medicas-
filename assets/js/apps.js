// Variables globales
let funcionariosData = [];
let funcionarioActual = null;
let imagenSeleccionada = null;

// Función para formatear RUT chileno
function formatearRut(rut) {
    rut = rut.replace(/\./g, '').replace('-', '');
    if (rut.length <= 1) return rut;
    
    let cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1);
    
    cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${cuerpo}-${dv}`;
}

// Validar formato de RUT
function validarRut(rut) {
    const pattern = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
    return pattern.test(rut);
}

// Cargar datos mockeados
function cargarDatos() {
    // Simular carga de JSON (en producción usar fetch)
    funcionariosData = [
        {
            "rut": "12.345.678-9",
            "nombre": "Juan Pérez González",
            "departamento": "Recursos Humanos",
            "estado": "pendiente",
            "foto": null
        },
        {
            "rut": "15.678.901-2",
            "nombre": "María Rodríguez Silva",
            "departamento": "Finanzas",
            "estado": "autorizada",
            "foto": null
        },
        {
            "rut": "18.234.567-3",
            "nombre": "Carlos Martínez López",
            "departamento": "IT",
            "estado": "rechazada",
            "foto": null
        },
        {
            "rut": "20.123.456-7",
            "nombre": "Ana Gómez Ramírez",
            "departamento": "Marketing",
            "estado": "pendiente",
            "foto": null
        },
        {
            "rut": "22.987.654-1",
            "nombre": "Luis Torres Vargas",
            "departamento": "Ventas",
            "estado": "autorizada",
            "foto": null
        }
    ];
}

// Buscar funcionario por RUT
function buscarFuncionario(rut) {
    return funcionariosData.find(f => f.rut === rut);
}

// Mostrar mensaje de estado
function mostrarMensaje(mensaje, tipo) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = mensaje;
    statusMessage.className = 'status-message ' + tipo;
    
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 5000);
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('estadoSelect').value = '';
    document.getElementById('fileUpload').value = '';
    document.getElementById('previewContainer').innerHTML = '';
    imagenSeleccionada = null;
}

// Manejar eventos
document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();
    
    const rutInput = document.getElementById('rutInput');
    const ingresarBtn = document.getElementById('ingresarBtn');
    const volverBtn = document.getElementById('volverBtn');
    const guardarBtn = document.getElementById('guardarBtn');
    const limpiarBtn = document.getElementById('limpiarBtn');
    const uploadArea = document.getElementById('uploadArea');
    const fileUpload = document.getElementById('fileUpload');
    
    // Formatear RUT mientras se escribe
    rutInput.addEventListener('input', function(e) {
        let valor = e.target.value;
        valor = valor.replace(/\D/g, '');
        e.target.value = formatearRut(valor);
    });
    
    // Ingresar con RUT
    ingresarBtn.addEventListener('click', function() {
        const rut = rutInput.value.trim();
        
        if (!rut) {
            mostrarMensaje('Por favor ingrese un RUT', 'error');
            return;
        }
        
        if (!validarRut(rut)) {
            mostrarMensaje('Formato de RUT inválido', 'error');
            return;
        }
        
        const funcionario = buscarFuncionario(rut);
        
        if (funcionario) {
            funcionarioActual = funcionario;
            mostrarCardGestion(funcionario);
        } else {
            mostrarMensaje('Funcionario no encontrado', 'error');
        }
    });
    
    // Volver al inicio
    volverBtn.addEventListener('click', function() {
        document.getElementById('rutCard').style.display = 'block';
        document.getElementById('gestionCard').style.display = 'none';
        rutInput.value = '';
        limpiarFormulario();
    });
    
    // Guardar cambios
    guardarBtn.addEventListener('click', function() {
        const estado = document.getElementById('estadoSelect').value;
        
        if (!estado) {
            mostrarMensaje('Seleccione un estado', 'error');
            return;
        }
        
        if (!imagenSeleccionada && !funcionarioActual.foto) {
            mostrarMensaje('Debe subir una imagen de respaldo', 'error');
            return;
        }
        
        // Actualizar datos (simulado)
        funcionarioActual.estado = estado;
        if (imagenSeleccionada) {
            funcionarioActual.foto = imagenSeleccionada;
        }
        
        mostrarMensaje('Cambios guardados exitosamente', 'success');
        limpiarFormulario();
    });
    
    // Limpiar formulario
    limpiarBtn.addEventListener('click', limpiarFormulario);
    
    // Manejar arrastrar y soltar
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#2C3E50';
        uploadArea.style.backgroundColor = 'rgba(44, 62, 80, 0.1)';
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.style.borderColor = '';
        uploadArea.style.backgroundColor = '';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '';
        uploadArea.style.backgroundColor = '';
        
        if (e.dataTransfer.files.length) {
            fileUpload.files = e.dataTransfer.files;
            manejarArchivo(fileUpload.files[0]);
        }
    });
    
    // Clic en área de subida
    uploadArea.addEventListener('click', function() {
        fileUpload.click();
    });
    
    // Cambio en input file
    fileUpload.addEventListener('change', function() {
        if (this.files.length) {
            manejarArchivo(this.files[0]);
        }
    });
});

// Mostrar card de gestión
function mostrarCardGestion(funcionario) {
    document.getElementById('nombreFuncionario').textContent = funcionario.nombre;
    document.getElementById('rutMostrado').textContent = funcionario.rut;
    document.getElementById('deptoFuncionario').textContent = funcionario.departamento;
    document.getElementById('estadoSelect').value = funcionario.estado;
    
    if (funcionario.foto) {
        mostrarVistaPrevia(funcionario.foto);
    }
    
    document.getElementById('rutCard').style.display = 'none';
    document.getElementById('gestionCard').style.display = 'block';
}

// Manejar archivo seleccionado
function manejarArchivo(file) {
    const previewContainer = document.getElementById('previewContainer');
    
    if (!file.type.match('image.*')) {
        mostrarMensaje('Solo se permiten imágenes', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
        mostrarMensaje('La imagen es demasiado grande (máx. 5MB)', 'error');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        imagenSeleccionada = e.target.result;
        mostrarVistaPrevia(imagenSeleccionada);
    };
    
    reader.readAsDataURL(file);
}

// Mostrar vista previa
function mostrarVistaPrevia(src) {
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = `<img src="${src}" alt="Vista previa">`;
}

// Tecla Enter en RUT
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.getElementById('rutCard').style.display !== 'none') {
        document.getElementById('ingresarBtn').click();
    }
});