window.onload = () => {

    professorFetch();
    document.getElementById("profesorSelect").addEventListener("change", newProfeSelected);
    showinMap(1,1);

}
newProfeSelected = () => {
    let newProfe = document.getElementById("profesorSelect").value;
    assignedStudents(newProfe, false);
}

clearTable = () => {

    let selected = document.querySelector(".selectedRow");
    if (selected != null) { selected.setAttribute("class", "newRow") };
    let previousTable = document.getElementsByClassName("newRow");
    for (row = previousTable.length - 1; row > -1; row--) {
        previousTable[row].remove()
    }
}

assignedStudents = (idprofe, firstFetch) => {
    if (firstFetch === false) {
        clearTable()
    };
    let alumnosForm = new FormData;
    alumnosForm.append("tipoconsulta", "T");
    alumnosForm.append("idprofesor", idprofe);
    let params = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        body: alumnosForm
    }
    fetch("http://alcyon-it.com/PQTM/pqtm_consulta_alumnos_logued.php", params)
        .then((respuesta => {
            if (respuesta.ok) {
                return respuesta.json();
            }
            else { throw "Error en petición." }
        }))
        .then(alumns => {
            let optionsNode = document.getElementById("llistaStudents");
            for (let i = 0; i < alumns.length; i++) {
                let html = `<tr class="newRow" id=${alumns[i].idalumno}><td>${alumns[i].idalumno} </td><td> ${alumns[i].nombre}</td><td>${alumns[i].profesor}</td></tr>`;
                optionsNode.insertAdjacentHTML("beforeEnd", html)
                document.getElementById(alumns[i].idalumno).addEventListener("click", () => { studentDetails(alumns[i].idalumno) });
            };
        })
        .catch(e => { console.log(e) })

}

professorFetch = () => {

    let tipoconsulta = new FormData();
    tipoconsulta.append("tipoconsulta", "A");

    params = {
        method: "post",
        body: tipoconsulta,
        mode: "cors",
        cache: "no-cache"
    };
    fetch("http://alcyon-it.com/PQTM/pqtm_consulta_profesores.php", params)
        .then(respuesta => {
            if (respuesta.ok) {
                return respuesta.json()
            }
            else { throw "Error en petición." }
        })
        .then(profesores => {
            for (let i in profesores) {
                const llistaProfes = document.getElementById('profesorSelect');
                const html = `<option class="newSelect" value=${profesores[i].idteacher}>${profesores[i].nombre}</option>`;
                llistaProfes.insertAdjacentHTML('beforeEnd', html);
            };
            assignedStudents(0, true);

        })
        .catch(error => {
            console.log(error);
        })

}

studentDetails = (idstudent) => {

    let previousSelection = document.querySelector(".selectedRow");
    if (previousSelection != null) previousSelection.setAttribute("class", "newRow");
    document.getElementById(idstudent).setAttribute("class", "selectedRow");
    let studentForm = new FormData;
    studentForm.append("tipoconsulta", "A");
    studentForm.append("id", idstudent);
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
            showinMap(response[0].lat, response[0].long, response[0].nombre);
            if (response[0].foto) showPicture(response[0].foto);
            else{
                let previousPic= document.getElementById("actualPic");
                if (previousPic!=null){previousPic.remove()};

            }

        })
        .catch(e => { console.log(e) })
}

showinMap = (latitud, longitud, name) => {
    lat=Number(latitud);
    lng=Number(longitud);
    if (lat===null || lng===null){
        alert ("L'alumne no està localitzable");
        lat=1;
        lng=1;
    };
    let opcionesMapa = {
        center: {lat, lng},
        zoom: 10,
        mapTypeId: "roadmap"
    };
    const map = new google.maps.Map(document.getElementById("map"),
        opcionesMapa);
        let latlngmarks = new google.maps.LatLng(lat,lng);
        var mapMarker = new google.maps.Marker({
        position:latlngmarks,
        title: name,
        });
        mapMarker.setMap(map);
}

showPicture=(pic)=>{
    let previousPic= document.getElementById("actualPic");
    if (previousPic!=null){previousPic.remove()};
    let node = document.getElementById("imageHolder");
    let html = `<img id="actualPic" src= "http://alcyon-it.com/PQTM/img/${pic}">`;
    node.insertAdjacentHTML("beforeEnd", html)


}