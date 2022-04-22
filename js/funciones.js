const formulario = document.querySelector('#formulario')

let DB;

function conectarDB() {
    // ABRIR CONEXIÓN EN LA BD:
    const abrirConexion = window.indexedDB.open('CRM', 1);

    // si hay un error, lanzarlo
    abrirConexion.onerror = function() {
        console.log('Hubo un error');
    };

    // si todo esta bien, asignar a database el resultado
    abrirConexion.onsuccess = function() {
        DB = abrirConexion.result;
    }
}

function imprimirAlerta(mensaje, tipo) {
    //crear la alerta

    const alerta = document.querySelector('.alerta');

    if(!alerta) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');

        if(tipo === 'error') {
            divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
        } else {
            divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
        }

        divMensaje.textContent = mensaje;

        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);   
    }
}