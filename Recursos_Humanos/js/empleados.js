window.onload= init;
var headers = {};
var url = "http://localhost:3000";

function init(){
    if(localStorage.getItem("token")){
        headers = {
            headers:{
                'Authorization': "bearer " + localStorage.getItem("token")
            }
        }
        loadEmpleados();

        document.getElementById("btn-save").addEventListener("click", saveEmpleado);
        document.getElementById("btn-cancel").addEventListener("click", resetForm);
        document.getElementById("btn-search").addEventListener("click", searchEmpleado);
        document.getElementById("btn-reset").addEventListener("click", function () {
            document.getElementById("input-search").value = "";
            loadEmpleados();
        });
        document.getElementById("btn-logout").addEventListener("click", logout);
    }
    else{
        window.location.href="index.html";
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

function loadEmpleados(){
    axios.get(url + "/empleados", headers)
    .then(function(res) {
        displayEmpleados(res.data.message);
    }).catch(function(err) {
        console.log(err);
    })
}

function searchEmpleado() {
    var nombre = document.getElementById("input-search").value.trim();
    if (!nombre) {
        loadEmpleados();
        return;
    }

    axios.get(url + "/empleados/" + encodeURIComponent(nombre), headers)
        .then(function (res) {
            displayEmpleados(res.data.message);
        })
        .catch(function (err) {
            if (err.response && err.response.status === 404) {
                document.getElementById("tabla-empleados").innerHTML =
                    '<tr><td colspan="7" class="text-center text-muted py-3">No se encontraron empleados con ese nombre.</td></tr>';
            } else {
                handleAuthError(err);
            }
        });
}

function displayEmpleados(empleados) {
    var tbody = document.getElementById("tabla-empleados");
    tbody.innerHTML = "";

    if (empleados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-3">No hay empleados registrados.</td></tr>';
        return;
    }

    for (var i = 0; i < empleados.length; i++) {
        var emp = empleados[i];
        tbody.innerHTML += `
            <tr>
                <td>${emp.empleado_id}</td>
                <td>${emp.nombre}</td>
                <td>${emp.apellidos}</td>
                <td>${emp.telefono}</td>
                <td>${emp.correo}</td>
                <td>${emp.direccion}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editEmpleado(${emp.empleado_id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteEmpleado(${emp.empleado_id})">Eliminar</button>
                </td>
            </tr>
        `;
    }
}

function saveEmpleado() {
    var id = document.getElementById("empleado-id").value;
    var data = {
        nombre: document.getElementById("nombre").value.trim(),
        apellidos: document.getElementById("apellidos").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        direccion: document.getElementById("direccion").value.trim()
    };

    if (!data.nombre || !data.apellidos || !data.telefono || !data.correo || !data.direccion) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    if (id) {
        // Actualizar existente (PUT)
        axios.put(url + "/empleados/" + id, data, headers)
            .then(function (res) {
                alert(res.data.message);
                resetForm();
                loadEmpleados();
            })
            .catch(function (err) {
                handleAuthError(err);
            });
    } else {
        // Crear nuevo (POST)
        axios.post(url + "/empleados", data, headers)
            .then(function (res) {
                alert(res.data.message);
                resetForm();
                loadEmpleados();
            })
            .catch(function (err) {
                handleAuthError(err);
            });
    }
}

function editEmpleado(id) {
    axios.get(url + "/empleados/" + id, headers)
        .then(function (res) {
            var emp = res.data.message[0];
            document.getElementById("empleado-id").value = emp.empleado_id;
            document.getElementById("nombre").value = emp.nombre;
            document.getElementById("apellidos").value = emp.apellidos;
            document.getElementById("telefono").value = emp.telefono;
            document.getElementById("correo").value = emp.correo;
            document.getElementById("direccion").value = emp.direccion;

            document.getElementById("form-title").innerText = "Modificar Empleado #" + emp.empleado_id;
            document.getElementById("btn-save").innerText = "Actualizar Empleado";
            document.getElementById("btn-cancel").classList.remove("d-none");
            window.scrollTo(0, 0);
        })
        .catch(function (err) {
            handleAuthError(err);
        });
}

function deleteEmpleado(id) {
    if (confirm("¿Estás seguro de eliminar este empleado?")) {
        axios.delete(url + "/empleados/" + id, headers)
            .then(function (res) {
                alert(res.data.message);
                loadEmpleados();
            })
            .catch(function (err) {
                handleAuthError(err);
            });
    }
}

function resetForm() {
    document.getElementById("empleado-id").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("apellidos").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("correo").value = "";
    document.getElementById("direccion").value = "";

    document.getElementById("form-title").innerText = "Agregar Nuevo Empleado";
    document.getElementById("btn-save").innerText = "Guardar Empleado";
    document.getElementById("btn-cancel").classList.add("d-none");
}

function handleAuthError(err) {
    if (err.response && err.response.status === 401) {
        alert("Sesión expirada o no autorizada.");
        logout();
    } else {
        console.log(err);
        alert("Ocurrió un error al procesar la solicitud.");
    }
}