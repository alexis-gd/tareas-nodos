document.getElementById('add_tarea').addEventListener('click', function(event) {
    validar("add");
});

document.getElementById('save_tarea').addEventListener('click', function(event) {
    event.preventDefault();
    var formulario = document.getElementById("form");
    var mensaje = document.getElementById("mensaje");
    var descripcion = document.getElementById("descripcion");
    var ticket = document.getElementById("ticket");
    var tiempo = document.getElementById("tiempo");
    const datos = new FormData(formulario);
    datos.append('opcion', 'addDatos');
    if (descripcion.value == "") {
        mensaje.innerText = "¡Ingresa una descripción!";
        setTimeout(() => {
            mensaje.innerText = "";
        }, 2500);
    } else {
        fetch('function/actions.php', {
                method: 'POST',
                body: datos
            })
            .then(function(response) {
                console.log(response)
                if (response != 0) {
                    descripcion.value = "";
                    ticket.value = "";
                    tiempo.value = "";
                    mensaje.innerText = "¡Tarea insertada correctamente!";
                    validar("add");
                    getDatos();
                    setTimeout(() => {
                        mensaje.innerText = "";
                    }, 3000);
                } else {
                    mensaje.innerText = "datos no insertados";
                }
            })
    }
});

const validar = (id) => {
    const idValidate = document.getElementById(id);
    if (idValidate.classList.contains('d-none')) {
        idValidate.classList.remove('d-none');
    } else {
        idValidate.classList.add('d-none');
    }
}

const deleteDatos = (id) => {
    const datos = new FormData();
    datos.append('opcion', 'deleteDatos');
    datos.append('id_borrar', id);
    fetch('function/actions.php', {
            method: 'POST',
            body: datos
        })
        .then(res => res.text())
        .then(data => {
            document.getElementById("tabla_datos").innerHTML = " ";
            if (data == 1) {
                mensaje.innerText = "¡Tarea borrada!";
                setTimeout(() => {
                    mensaje.innerText = "";
                }, 2000);
                getDatos();
            } else if (data == 0) {
                mensaje.innerText = "No hay datos que borrar";
                getDatos();
            } else {
                mensaje.innerText = "Falla al borrar datos";
            }
        })
}
const updateDatosGeneral = ( id_tarea, value, descripcion, ticket, tiempo ) => {
    const datos = new FormData();
    datos.append('opcion', 'updateDatosGeneral');
    datos.append('id_tarea', id_tarea);
    datos.append('value', value);
    datos.append('descripcion', descripcion);
    datos.append('ticket', ticket);
    datos.append('tiempo', tiempo);
    fetch('function/actions.php', {
            method: 'POST',
            body: datos
        })
        .then(function(response) {
            if (response != 0) {
                mensaje.innerText = "¡Se guardo correctamente!";
                setTimeout(() => {
                    mensaje.innerText = "";
                }, 500);
                getDatos();
            } else {
                mensaje.innerText = "Falla al guardar el datos";
            }
        })
}

const updateDatos = (id, estado) => {
    const datos = new FormData();
    datos.append('opcion', 'updateDatos');
    datos.append('id_tarea', id);
    datos.append('estado', estado);
    fetch('function/actions.php', {
            method: 'POST',
            body: datos
        })
        .then(function(response) {
            if (response != 0) {
                mensaje.innerText = "¡Estado actualizado!";
                setTimeout(() => {
                    mensaje.innerText = "";
                }, 500);
                getDatos();
            } else {
                mensaje.innerText = "Falla al cambiar el estado";
            }
        })
}

const getDatos = () => {
    const datos = new FormData();
    datos.append('opcion', 'getDatos');
    fetch('function/actions.php', {
            method: 'POST',
            body: datos
        })
        .then(res => res.json())
        .then(response => {
            if (response != 0) {
                const datos = document.getElementById("tabla_datos");
                datos.innerHTML = response;
            } else {
                mensaje.innerText = "No hay datos disponibles";
            }
            for (everyMatch of document.querySelectorAll('.badge')) {
                document.getElementById(everyMatch.id).addEventListener('click', function(event) {
                    updateDatos(this.id, this.dataset.value);
                });
            }
            for (everyMatch of document.querySelectorAll('.save_tarea')) {
                document.getElementById(everyMatch.id).addEventListener('click', function(event) {
                        let descripcion = document.getElementById("descripcion_" + this.dataset.value).value;
                        let ticket = document.getElementById("ticket_" + this.dataset.value).value;
                        let tiempo = document.getElementById("tiempo_" + this.dataset.value).value;
                        updateDatosGeneral(this.id, this.dataset.value, descripcion, ticket, tiempo);                        
                });
            }
            for (everyMatch of document.querySelectorAll('.del_tarea')) {
                document.getElementById(everyMatch.id).addEventListener('click', function(event) {
                    deleteDatos(this.value);
                });
            }
        })
}
getDatos();