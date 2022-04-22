(function() {

    let DB;
    const listadoClientes = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', () => {
        crearDB();

        if(window.indexedDB.open('CRM', 1)) {
            obtenerClientes();
        }

        listadoClientes.addEventListener('click', eliminarRegistro);
    });

    //Elimina registro
    function eliminarRegistro(e) {
        if(e.target.classList.contains('eliminar')){
            const idEliminar = Number( e.target.dataset.cliente );

            const confirmar = confirm('Deseas eliminar este cliente?');

            if(confirmar) {
                const transaction = DB.transaction(['CRM'], 'readwrite');
                const objectStore = transaction.objectStore('CRM');

                objectStore.delete(idEliminar);

                transaction.oncomplete = function () {
                    console.log('Eliminando..');

                    e.target.parentElement.parentElement.remove();
                };

                transaction.onerror= function() {
                    console.log('Hubo un error')
                }
            }

        }
    }

    //crea la base de datos
    function crearDB() {
        const crearDB = window.indexedDB.open('CRM', 1);

        crearDB.onerror = function() {
            console.log('Hubo un error');
        };

        crearDB.onsuccess = function() {
            DB = crearDB.result;
        };

        crearDB.onupgradeneeded = function(e) {
            const db = e.target.result;

            const objectStore = db.createObjectStore('CRM', {
                keyPath: 'id',
                autoIncrement: true
            });

            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('apellido', 'apellido', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });

            console.log('DB lista y creada');
        }
    }

    function obtenerClientes() {
        const abrirConexion = window.indexedDB.open('CRM', 1);

            abrirConexion.onerror = function() {
                console.log('Hubo un error');
            };
    
            // si todo esta bien, asignar a database el resultado
            abrirConexion.onsuccess = function() {
                DB = abrirConexion.result;

                const objectStore = DB.transaction('CRM').objectStore('CRM');

                objectStore.openCursor().onsuccess = function(e) {
                    const cursor = e.target.result;

                    if(cursor) {
                        const { nombre, apellido, email, telefono, empresa, id } = cursor.value;

                        listadoClientes.innerHTML += `
                            <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} ${apellido} </p>
                                <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${telefono}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${empresa}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                            </td>
                            </tr>
                        `;

                        cursor.continue();
                    } else {
                        console.log('No hay registros');
                    }
                }
            }
    }

})();