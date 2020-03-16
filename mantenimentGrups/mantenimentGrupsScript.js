window.onload = () => {

    professorFetch();
    document.getElementById("profeForm").addEventListener("change", newProfeSelected);
    document.getElementById("afegirGrup").addEventListener("click", addNouGrup);
    document.getElementById("participantsButton").addEventListener("click", showParticipantsList);
    document.getElementById("modificarGrup").addEventListener("click", modificarGrup);
    document.getElementById("eliminarGrup").addEventListener("click", eliminarGrup);

}

var activeGrup = undefined;

modificarGrup = () => {
    let nouNom = document.getElementById("nomGrupForm").value;
    let novaDesc = document.getElementById("desc").value;
    if (nouNom.length <= 3) {
        alert("Cal donar un nom al grup, de com a mínim 4 caràcters.")
    }
    else if (novaDesc.length <= 5) {
        alert("Cal donar una descripció al grup, de com a mínim 6 caràcters.")
    }
    else {

        let modGrup = new FormData;
        modGrup.append("nombre", nouNom);
        modGrup.append("descripcion", novaDesc);
        modGrup.append("idgrupo", activeGrup);
        let params = {
            method: "POST",
            body: modGrup,
            mode: "cors",
            cache: "no-cache"
        };
        fetch("http://alcyon-it.com/PQTM/pqtm_modificacion_grupos.php", params)
            .then((respuesta => {
                if (respuesta.ok) {
                    return respuesta.text();
                }
                else { throw "Error en petición." }
            }))
            .then(response => {
                alert(response);

            })
            .catch(e => { console.log(e) })
    }

}

eliminarGrup = () => {
    let borrar = confirm("Un cop realitzada aquesta acció no pot ser desfeta. N'està segur/a?")
    if (borrar === true) {
        let nouGrup = new FormData;
        nouGrup.append("idgrupo", activeGrup);
        let params = {
            method: "POST",
            body: nouGrup,
            mode: "cors",
            cache: "no-cache"
        };
        fetch("http://alcyon-it.com/PQTM/pqtm_baja_grupos.php", params)
            .then((respuesta => {
                if (respuesta.ok) {
                    return respuesta.text();
                }
                else { throw "Error en petición." }
            }))
            .then(response => {
                alert(response);
                if (response.substring(0, 2) == 00) { newProfeSelected(); }

            })
            .catch(e => { console.log(e) })
    }

}

addNouGrup = () => {
    let nomGrup = document.getElementById("nomGrupForm").value;
    let descripcio = document.getElementById("desc").value;
    let currentProfe = document.getElementById("profeSelect").value;
    let currentProfeId = Number(document.querySelector(`option[value="${currentProfe}"]`).id);
    if (nomGrup.length <= 3) {
        alert("Cal donar un nom al grup, de com a mínim 4 caràcters.")
    }
    else if (descripcio.length <= 5) {
        alert("Cal donar una descripció al grup, de com a mínim 6 caràcters.")
    }
    else {
        let nouGrup = new FormData;
        nouGrup.append("nombre", nomGrup);
        nouGrup.append("descripcion", descripcio);
        nouGrup.append("idprofesor", currentProfeId);
        let params = {
            method: "POST",
            body: nouGrup,
            mode: "cors",
            cache: "no-cache"
        };
        fetch("http://alcyon-it.com/PQTM/pqtm_alta_grupos.php", params)
            .then((respuesta => {
                if (respuesta.ok) {
                    return respuesta.text();
                }
                else { throw "Error en petición." }
            }))
            .then(response => {
                if (response.substring(0, 2) === "00") {
                    alert(response);
                    newProfeSelected();
                }
                else{alert(response)};
            })
            .catch(e => { console.log(e) })
    }
}

professorFetch = () => {

    let profesorFetchData = new FormData;
    profesorFetchData.append("tipoconsulta", "A")
    let params = {
        method: "POST",
        body: profesorFetchData,
        mode: "cors",
        cache: "no-cache"
    };
    fetch("http://alcyon-it.com/PQTM/pqtm_consulta_profesores.php", params)
        .then((respuesta => {
            if (respuesta.ok) {
                return respuesta.json();
            }
            else { throw "Error en petición." }
        }))
        .then(response => {
            let optionsNode = document.getElementById("profeSelect");
            for (i in response) {
                let html = `<option id=${response[i].idteacher} value="${response[i].nombre}">${response[i].nombre}</option>`
                optionsNode.insertAdjacentHTML("beforeEnd", html);
            }
            newProfeSelected();
        })
        .catch(e => { console.log(e) })
}

clearTable = () => {
    document.getElementById("nouGrup").reset();
    document.getElementById("nomGrupForm").value = "";
    document.getElementById("hiddenWrap").setAttribute("class", "hiddenDiv");
    let currentDisplay = document.querySelector("#participants.hiddenDiv");
    if (currentDisplay === null) {
        let hideDisplay = document.querySelector("#participants");
        hideDisplay.setAttribute("class", "participants hiddenDiv");
    }
    const active = document.querySelector(".selectedRow");
    if (active != null) { active.setAttribute("class", "newRow"); }
    let previousTable = document.getElementsByClassName("newRow");
    for (row = previousTable.length - 1; row > -1; row--) {
        previousTable[row].remove()   //AQUI ARA TENIM BUIDA LA TAULA
    }
    document.querySelector("#eliminarGrup").setAttribute("disabled", "true");
    document.querySelector("#modificarGrup").setAttribute("disabled", "true");
    document.getElementById("participantsButton").setAttribute("class", "activeButton");
    document.getElementById("eliminarGrup").setAttribute("class", "inactiveButton");
    document.getElementById("modificarGrup").setAttribute("class", "inactiveButton"); //ARA HEM DESACTIVAT ELS BOTONS
}

showParticipantsList = () => {
    let currentDisplay = document.querySelector("#participants.hiddenDiv");
    if (currentDisplay != null) {
        currentDisplay.setAttribute("class", "participants");
        document.getElementById("participantsButton").setAttribute("class", "activeButton buttonisOn");
    }
    else {
        let hideDisplay = document.querySelector("#participants");
        document.getElementById("participantsButton").setAttribute("class", "activeButton");
        hideDisplay.setAttribute("class", "participants hiddenDiv");
    }

}

loadParticipants = (parti) => {
    let previousList = document.querySelectorAll(".newParticip");
    if (previousList != null) {
        for (row = previousList.length - 1; row > -1; row--) {
            previousList[row].remove()   //AQUI ARA TENIM BUIDA LA TAULA
        }
        for (alum in parti) {
            const llistaGrups = document.getElementById('participants');
            const html = `<li class="newParticip" id=particip${parti[alum].idalumno}>${parti[alum].nombrealumno} </li>`;
            llistaGrups.insertAdjacentHTML('beforeEnd', html);
        }

    }
}

selectGrup = (id) => {
    document.getElementById("participantsButton").setAttribute("class", "activeButton");
    let currentDisplay = document.querySelector("#participants.hiddenDiv");
    if (currentDisplay === null) {
        let hideDisplay = document.querySelector("#participants");
        hideDisplay.setAttribute("class", "participants hiddenDiv");
    }
    document.getElementById("nouGrup").reset();
    let previousSelection = document.querySelector(".selectedRow");
    if (previousSelection != null) previousSelection.setAttribute("class", "newRow");
    document.getElementById(`grupo${id}`).setAttribute("class", "selectedRow");
    let inactiveButtons = document.querySelectorAll(".inactiveButton");
    for (let i = 0; i < inactiveButtons.length; i++) {
        inactiveButtons[i].setAttribute("class", "activeButton");
        inactiveButtons[i].removeAttribute("disabled");
    }
    let grupDetails = new FormData;
    grupDetails.append("tipoconsulta", "G");
    grupDetails.append("idgrupo", id);
    let params = {
        method: "POST",
        body: grupDetails,
        mode: "cors",
        cache: "no-cache"
    };
    fetch("http://alcyon-it.com/PQTM/pqtm_consulta_grupos.php", params)
        .then((respuesta => {
            if (respuesta.ok) {
                return respuesta.json();
            }
            else { throw "Error en petición." }
        }))
        .then(response => {
            activeGrup = response[0].idgrupo;
            document.getElementById("nomGrupForm").setAttribute("value", response[0].nombregrupo);
            document.getElementById("desc").value = response[0].descgrupo;
            if (response[0].numparticipantes > 0) {
                document.getElementById("hiddenWrap").setAttribute("class", "visible");
                document.getElementById("participantsButton").innerHTML = `${response[0].numparticipantes} Participant/s.`
                loadParticipants(response[0].participantes)
            }
            else {
                document.getElementById("hiddenWrap").setAttribute("class", "hiddenDiv");
            }
        })
        .catch(e => { console.log(e) })

}

newProfeSelected = () => {
    clearTable()
    let currentProfe = document.getElementById("profeSelect").value;
    let currentProfeId = document.querySelector(`option[value="${currentProfe}"]`).id;
    document.getElementById("formador").setAttribute("value", currentProfe);
    let gruposFetchData = new FormData;
    gruposFetchData.append("tipoconsulta", "P");
    gruposFetchData.append("idprofesor", currentProfeId)
    let params = {
        method: "POST",
        body: gruposFetchData,
        mode: "cors",
        cache: "no-cache"
    };
    fetch("http://alcyon-it.com/PQTM/pqtm_consulta_grupos.php", params)
        .then((respuesta => {
            if (respuesta.ok) {
                return respuesta.json();
            }
            else { throw "Error en petición." }
        }))
        .then(response => {
            for (i in response) {
                const llistaGrups = document.getElementById('llistaGrups');
                const html = `<tr class="newRow" id=grupo${response[i].idgrupo}><td>${response[i].idgrupo} </td><td> ${response[i].nombregrupo}</td><td>${response[i].participantes}</td></tr>`;
                llistaGrups.insertAdjacentHTML('beforeEnd', html);
            }
            let trs = document.querySelectorAll(".newRow");

            for (let i = 0; i < trs.length; i++) {
                let id = Number((trs[i].id).substr(5));
                trs[i].onclick = () => { selectGrup(id) };
            }

        })
        .catch(e => { console.log(e) })

}


