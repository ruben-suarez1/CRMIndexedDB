(function() {

    let idCliente;

    const nombreInput = document.querySelector('#nombre');
    const apellidoInput = document.querySelector('#apellido');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        //Actualiza el registro
        formulario.addEventListener('submit', actualizarCliente);

        //Verificar el id de la url
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');

        if(idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);
        }
    });

    function actualizarCliente(e) {
        e.preventDefault();

        if( nombreInput.value === '' || apellidoInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '') {

            imprimirAlerta('Todos los campos son obligatorios', 'error')

            return;
        }

        //Actualizar cliente
        const clienteActualizados = {
            nombre: nombreInput.value,
            apellido: apellidoInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        };
        
        const transaction = DB.transaction(['CRM'], 'readwrite');
        const objectStore = transaction.objectStore('CRM');

        objectStore.put(clienteActualizados);

        transaction.onerror = function() {
            imprimirAlerta('Hubo un error', 'error');
        };

        transaction.oncomplete = function() {
            imprimirAlerta('Cliente Editado Correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);

        }
    }

    function obtenerCliente(id) {
        const transaction = DB.transaction(['CRM'], 'readonly');
        const objectStore = transaction.objectStore('CRM');

        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e) {
            const cursor = e.target.result;

            if(cursor) {

                if(cursor.value.id === Number(id)) {
                    llenarFormulario(cursor.value);
                }

                cursor.continue();
            }
        }
    }

    function llenarFormulario(dastosCliente) {
        const { nombre, apellido, email, telefono, empresa } = dastosCliente;

        nombreInput.value = nombre;
        apellidoInput.value = apellido;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }

})();