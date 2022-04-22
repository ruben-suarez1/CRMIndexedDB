(function() {

    document.addEventListener('DOMContentLoaded', () => {

        conectarDB();

        formulario.addEventListener('submit', validarCliente);

    });

    function validarCliente(e) {
        e.preventDefault();

        //Leer todos los inputs
        const nombre = document.querySelector('#nombre').value;
        const apellido = document.querySelector('#apellido').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if( nombre === '' || apellido === '' || email === '' || telefono === '' || empresa === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');

            return;
        } 

        // añadir a la BD...
        //Crearun objeto con la información
        const cliente = {
            nombre,
            apellido,
            email,
            telefono,
            empresa
        }

        cliente.id = Date.now();

       crearNuevoCliente(cliente);
    }

    function crearNuevoCliente(cliente) {
        // NUEVO:
        const transaction = DB.transaction(['CRM'], 'readwrite');

        const objectStore = transaction.objectStore('CRM');

        objectStore.add(cliente);

        transaction.onerror = function() {
            imprimirAlerta('Hubo un error', 'error');
        };

        transaction.oncomplete = function() {
            imprimirAlerta('Cliente Agregado Correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);

        }
    }

})();