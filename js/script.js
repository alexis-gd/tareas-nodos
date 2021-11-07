document.getElementById('add_tarea').addEventListener('click', function(event) {
    validar("add");
});

document.getElementById('save_tarea').addEventListener('click', function(event) {
    event.preventDefault();
    var formulario = document.getElementById("form");
    var mensaje = document.getElementById("mensaje");
    var descripcion = document.getElementById("descripcion");
    const datos = new FormData(formulario);
    datos.append('opcion', 'addDatos');
    if (descripcion.value == "") {
        mensaje.innerText = "¡Ingresa una descripción!";
        setTimeout(() => {
            mensaje.innerText = "";
        }, 2000);
    } else {
        fetch('function/actions.php', {
                method: 'POST',
                body: datos
            })
            .then(function(response) {
                if (response != 0) {
                    descripcion.value = "";
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
            for (everyMatch of document.querySelectorAll('.del_tarea')) {
                document.getElementById(everyMatch.id).addEventListener('click', function(event) {
                    deleteDatos(this.value);
                });
            }
        })
}
getDatos();