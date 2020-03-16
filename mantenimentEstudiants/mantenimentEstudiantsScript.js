window.onload = () => {
    professorFetch(1, true);
    uploadButton();
    document.getElementById("profesorSelect").addEventListener("change", newProfeSelected);
    document.getElementById("formadorSelectGrups").addEventListener("change", newProfeGrups);
    document.getElementById("addStudent").addEventListener("click", addStudent);
    document.getElementById("eliminarStudent").addEventListener("click", eliminarStudent);
    document.getElementById("modificarStudent").addEventListener("click", modificarStudent);
    document.getElementById("clearFormButton").addEventListener("click", resetDetailsForm);

}

var currentSudent = undefined;
var currentTeacher = undefined;
var currentPag = undefined;

fetchFormData = (ismod) => {
    let nom = document.getElementById("nom").value;
    let user = document.getElementById("usuari").value;
    let email = document.getElementById("email").value;
    let profesor = document.getElementById("formadorSelectGrups").value;
    let grupo = document.getElementById("grupSelect").value;
    let foto = document.getElementById("photo").files[0];
    let data = [nom, user, email, Number(profesor), Number(grupo), foto];
    let validate = validateData(data, ismod);

    return ({ validate, data });
}

validateData = (data, ismod) => {
    let length;
    ismod === "true" ? length = 4 : length = 5;
    let index = ["Nom", "Usuari", "Email", "Formador", "Grup"]
    expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    let email = expr.test(data[2]);
    for (let i = 0; i < length; i++) {
        if ((data[i].length <= 3 && i < 3) || (i >= 3 && data[i] === 0)) {
            alert(`Tots els camps han de estar degudament emplenats. El camp "${index[i]}" no ho està.`);
            return ("false");
        }
        else if (email === false) {
            alert(`Tots els camps han de estar degudament emplenats. El camp "Email" no és vàlid.`);
            return ("false");
        }
    }
    return ("true");
}

eliminarStudent = () => {
    if (confirm("Un cop realitzada aquesta acció no pot ser desfeta. N'està segur/a?")) {
        let studentForm = new FormData;
        studentForm.append("idalumno", currentStudent);
        let params = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            body: studentForm
        }
        fetch("http://alcyon-it.com/PQTM/pqtm_baja_alumnos.php", params)
            .then((respuesta => {
                if (respuesta.ok) {
                    return respuesta.text();
                }
                else { throw "Error en petición." }
            }))
            .then(response => {
                alert(response.substring(2));
                if (response.substring(0, 2) === "00") {
                    resetDetailsForm();
                    assignedStudents(currentPag, currentTeacher, false);
                }
            })
            .catch(e => { console.log(e) })
    }
}

modificarStudent = () => {

    let data = fetchFormData("true");
    let studentForm = new FormData;
    studentForm.append("nombre", data.data[0]);
    studentForm.append("email", data.data[2]);
    studentForm.append("usuario", data.data[1]);
    studentForm.append("profesor", data.data[3]);
    studentForm.append("foto", data.data[5]);
    studentForm.append("idalumno", currentStudent);
    let params = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        body: studentForm
    }
    if (data.validate === "true") {
        fetch("http://alcyon-it.com/PQTM/pqtm_modificacion_alumnos.php", params)
            .then((respuesta => {
                if (respuesta.ok) {
                    return respuesta.text();
                }
                else { throw "Error en petición." }
            }))
            .then(response => {
                alert(response.substring(2));
                if (response.substring(0, 2) === "00") {
                    resetDetailsForm();
                    assignedStudents(currentPag, currentTeacher, false);
                }
            })
            .catch(e => { console.log(e) })
    }

}

toggleButtons = (bool) => {
    if (bool === "on") {
        let inactiveButtons = document.querySelectorAll(".inactiveButton.sw");
        for (let i = 0; i < inactiveButtons.length; i++) {
            inactiveButtons[i].setAttribute("class", "activeButton sw");
            inactiveButtons[i].removeAttribute("disabled");
        }
    }
    else {
        let activeButtons = document.querySelectorAll(".activeButton.sw");
        for (let i = 0; i < activeButtons.length; i++) {
            activeButtons[i].setAttribute("class", "inactiveButton sw");
            activeButtons[i].setAttribute("disabled", "true");
        }
    }
}

clearNode = (id) => {
    let selected = document.querySelector(id);
    for (row = selected.length - 1; row >= 0; row--) {
        selected[row].remove();
    };
}

clearTable = () => {

    let selected = document.querySelector(".selectedRow");
    if (selected != null) { selected.setAttribute("class", "newRow") };
    let previousTable = document.getElementsByClassName("newRow");
    parent = document.getElementById("paginacion")
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
    for (row = previousTable.length - 1; row > -1; row--) {
        previousTable[row].remove()
    }
}

showGrups = (idprofesor, idalumno) => {
    clearNode("#grupsList");
    document.getElementById("hiddenDiv").setAttribute("class", "flexContainerCentered");
    let grupsForm = new FormData;
    grupsForm.append("tipoconsulta", "A");
    grupsForm.append("id", idalumno)
    grupsForm.append("idprofesor", idprofesor);
    let params = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        body: grupsForm
    }
    fetch("http://alcyon-it.com/PQTM/pqtm_consulta_grupos_alumno.php", params)
        .then((respuesta => {
            if (respuesta.ok) {
                return respuesta.json();
            }
            else { throw "Error en petición." }
        }))
        .then(response => {
            let node = document.getElementById("grupsList");
            for (i in response) {
                let html = `<option value="${response[i].idgrupo}">${response[i].nombregrupo}</option>`
                node.insertAdjacentHTML("beforeend", html);
            }

        })
        .catch(e => { console.log(e) })
}

studentDetails = (id) => {
    document.getElementById("photoButton").innerHTML = "Afegir fotografia";
    document.getElementById("nouStudent").reset();
    let previousPic = document.getElementById("actualPic");
    if (previousPic != null) { previousPic.remove() };
    let previousSelection = document.querySelector(".selectedRow");
    if (previousSelection != null) previousSelection.setAttribute("class", "newRow");
    document.getElementById(id).setAttribute("class", "selectedRow");
    toggleButtons("on");
    let studentForm = new FormData;
    studentForm.append("tipoconsulta", "A");
    studentForm.append("id", id);
    let params = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        body: studentForm
    }
    fetch("http://alcyon-it.com/PQTM/pqtm_consulta_alumnos.php", params)
        .then((respuesta => {
            if (respuesta.ok) {
                return respuesta.json();
            }
            else { throw "Error en petición." }
        }))
        .then(response => {
            document.getElementById("nom").value = response[0].nombre;
            document.getElementById("usuari").value = response[0].user;
            document.getElementById("email").value = response[0].email;
            document.getElementById("formadorSelectGrups").value = response[0].idprofesor;
            currentStudent = response[0].idalumno;
            if (response[0].foto != undefined) {
                let node = document.getElementById("imageHolder");
                let html = `<img id="actualPic" src= "http://alcyon-it.com/PQTM/img/${response[0].foto}">`;
                node.insertAdjacentHTML("beforeEnd", html)
            }
            newProfeGrups(response[0].idprofesor);
            showGrups(response[0].idprofesor, currentStudent);

        })
        .catch(e => { console.log(e) })
}

addStudent = () => {
    let data = fetchFormData();
    if (data.validate === "true") {
        let studentForm = new FormData;
        studentForm.append("opcion", "AA");
        studentForm.append("nombre", data.data[0]);
        studentForm.append("email", data.data[2]);
        studentForm.append("usuario", data.data[1]);
        studentForm.append("profesor", data.data[3]);
        studentForm.append("grupo", data.data[4]);
        studentForm.append("foto", data.data[5]);
        let params = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            body: studentForm
        }
        fetch("http://alcyon-it.com/PQTM/pqtm_alta_alumnos.php", params)
            .then((respuesta => {
                if (respuesta.ok) {
                    return respuesta.text();
                }
                else { throw "Error en petición." }
            }))
            .then(response => {
                alert(response.substring(3));
                if (response.substring(0, 2) === "00") {
                    let newProfe = document.getElementById("formadorSelectGrups").value;
                    document.getElementById("profesorSelect").value = newProfe;
                    assignedStudents(1, newProfe, false);
                    resetDetailsForm();
                }
            })
            .catch(e => { console.log(e) })
    }
}

newProfeGrups = () => {
    clearNode("#grupSelect");
    let currentProfe = document.getElementById("formadorSelectGrups").value;
    let grupsForm = new FormData;
    grupsForm.append("tipoconsulta", "P");
    grupsForm.append("idprofesor", currentProfe);
    let params = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        body: grupsForm
    }
    fetch("http://alcyon-it.com/PQTM/pqtm_consulta_grupos.php", params)
        .then((respuesta => {
            if (respuesta.ok) {
                return respuesta.json();
            }
            else { throw "Error en petición." }
        }))
        .then(response => {
            for (i in response) {

                let node = document.getElementById("grupSelect");
                let html = `<option id=grup${response[i].idgrupo} value=${response[i].idgrupo}>${response[i].nombregrupo}</option>`;
                node.insertAdjacentHTML("beforeEnd", html)
            }
        })
        .catch(e => { console.log(e) })
}

resetDetailsForm = () => {
    clearNode("#grupSelect")
    nouStudent.reset();
    toggleButtons("off");
    let hiddenDiv = document.querySelector(".hidden");
    let oldpic = document.getElementById("actualPic");
    if (oldpic != null) oldpic.remove();
    document.getElementById("photoButton").innerHTML = "Afegir fotografia"
    if (hiddenDiv === null) {
        document.getElementById("hiddenDiv").setAttribute("class", "flexContainerCentered hidden");
    }

}

newProfeSelected = () => {
    resetDetailsForm()
    let newProfe = document.getElementById("profesorSelect").value;
    assignedStudents(1, newProfe, false);
}

assignedStudents = (pagina, idprofe, firstFetch) => {
    currentTeacher = idprofe;
    currentPag = pagina;
    if (firstFetch === false) {
        clearTable()
    };
    let alumnosForm = new FormData;
    alumnosForm.append("tipoconsulta", "T");
    alumnosForm.append("id", idprofe);
    alumnosForm.append("pag", pagina);
    let params = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        body: alumnosForm
    }
    fetch("http://alcyon-it.com/PQTM/pqtm_consulta_alumnos.php", params)
        .then((respuesta => {
            if (respuesta.ok) {
                return respuesta.json();
            }
            else { throw "Error en petición." }
        }))
        .then(response => {

            let optionsNode = document.getElementById("llistaStudents");
            let alumns = response[0];
            let paginas;
            (response[1] > 0) ? paginas = response[1] : paginas = 1;
            for (let i = 0; i < alumns.length; i++) {
                let html = `<tr class="newRow" id=${alumns[i].idalumno}><td>${alumns[i].idalumno} </td><td> ${alumns[i].nombre}</td><td>${alumns[i].profesor}</td></tr>`;
                optionsNode.insertAdjacentHTML("beforeEnd", html)
                document.getElementById(alumns[i].idalumno).addEventListener("click", () => { studentDetails(alumns[i].idalumno) });
            };
            for (let i = 1; i <= paginas; i++) {
                const listado = document.getElementById("paginacion");
                const html = `<span id="pag${i}" class="index">${i}</span>`;
                listado.insertAdjacentHTML("beforeEnd", html);
                document.getElementById(`pag${i}`).addEventListener("click", () => { assignedStudents(i, idprofe, false) });
            }
            document.getElementById("pag" + pagina).setAttribute("class", "activeIndex");
        })
        .catch(e => { console.log(e) })

}

professorFetch = (firstFetch) => {
    let professorForm = new FormData;
    professorForm.append("tipoconsulta", "A");
    let params = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        body: professorForm
    }
    fetch("http://alcyon-it.com/PQTM/pqtm_consulta_profesores.php", params)
        .then((respuesta => {
            if (respuesta.ok) {
                return respuesta.json();
            }
            else { throw "Error en petición." }
        }))
        .then(response => {
            let optionsNode = document.getElementById("profesorSelect");
            let optionsNode2 = document.getElementById("formadorSelectGrups");
            for (i in response) {
                let html = `<option id=prof${response[i].idteacher} value=${response[i].idteacher}>${response[i].nombre}</option>`
                optionsNode.insertAdjacentHTML("beforeEnd", html);
                optionsNode2.insertAdjacentHTML("beforeEnd", html);
            };
            assignedStudents(1, 0, firstFetch)
        })
        .catch(e => { console.log(e) })
}
//////////////////////////////////////////////

uploadButton = () => {

    let input = document.querySelector('#photo');
    let label = input.nextElementSibling;
    input.addEventListener('change', (e) => {
        fileName = e.target.files[0].name;
        if (fileName.length > 15) {
            shortName = fileName.substring(0, 14);
            label.innerHTML = (`Pujar ${shortName}...`);
        }
        else {
            label.innerHTML = (`Pujar ${fileName}`);
        }
        let previousPic = document.getElementById("actualPic");
        if (previousPic != null) { previousPic.remove() };
        let node = document.getElementById("imageHolder");
        let html = document.createElement("img");
        html.setAttribute("id","actualPic");
        html.src = window.URL.createObjectURL(e.target.files[0]);
        node.appendChild(html);
    });
}
