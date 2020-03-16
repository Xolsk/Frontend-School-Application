window.onload = () => {

    centresFetch();

}

validateCenter = () => {

    let currentCentre = document.getElementById("nouCentreInput").value
    currentCentre.trim();
    if (currentCentre.length >= 3) {
        document.getElementById("newCenterButton").setAttribute("class", "activeButton");
        document.getElementById("newCenterButton").removeAttribute("disabled");
    }
    else {
        document.getElementById("newCenterButton").setAttribute("class", "inactiveButton");
        document.getElementById("newCenterButton").setAttribute("disabled", "true");
    }
}

reload = () => {

    let previousTable = document.getElementsByClassName("newRow");
    for (row = previousTable.length - 1; row > -1; row--) {
        previousTable[row].remove()   //AQUI ARA TENIM BUIDA LA TAULA
    }
    centresFetch();
}

crearCentre = () => {

    let centre = document.getElementById("nouCentreInput").value.trim();
    nouCentre = new FormData;
    nouCentre.append("nombre", centre);
    let params = {
        method: "POST",
        body: nouCentre,
        mode: "cors",
        cache: "no-cache"
    };
    fetch("http://alcyon-it.com/PQTM/pqtm_alta_colegios.php", params)
        .then((respuesta => {
            if (respuesta.ok) {
                return respuesta.text();
            }
            else { throw "Error en petición." }
        }))
        .then(consulta => {
            alert(consulta);
            reload();

        })
        .catch(e => { (console.log(e)) });


}

editarCentre = (idCentre) => {

    let name = document.getElementById(idCentre).value;
    let newName = name.trim();
    let escolaForm = new FormData;
    escolaForm.append("nombre", newName);
    escolaForm.append("idcolegio", idCentre);
    let params = {
        method: "POST",
        body: escolaForm,
        mode: "cors",
        cache: "no-cache"
    };
    fetch("http://alcyon-it.com/PQTM/pqtm_modificacion_colegios.php", params)
        .then((respuesta => {
            if (respuesta.ok) {
                return respuesta.text();
            }
            else { throw "Error en petición." }
        }))
        .then(consulta => {
            alert(consulta);
            reload();
        })
        .catch(e => { (console.log(e)) });

}

eliminarCentre = (idCentre) => {

    let confirmElimination = confirm("Un cop realitzada aquesta opció no pot ser desfeta. N'està segur/a?")
    if (confirmElimination === true) {
        let escolaForm = new FormData;
        escolaForm.append("idcolegio", idCentre);
        let params = {
            method: "POST",
            body: escolaForm,
            mode: "cors",
            cache: "no-cache"
        };
        fetch("http://alcyon-it.com/PQTM/pqtm_baja_colegios.php", params)
            .then((respuesta => {
                if (respuesta.ok) {
                    return respuesta.text();
                }
                else { throw "Error en petición." }
            }))
            .then(consulta => {
                alert(consulta);
                reload();

            })
            .catch(e => { (console.log(e)) });
    }
}

centresFetch = () => {
    let params = {
        method: "POST",
        mode: "cors",
        cache: "no-cache"
    };
    fetch("http://alcyon-it.com/PQTM/pqtm_consulta_colegios.php", params)
        .then((respuesta => {
            if (respuesta.ok) {
                return respuesta.json();
            }
            else { throw "Error en petición." }
        }))
        .then(consulta => {
            const llistaCentres = document.getElementById('llistaCentres');
            for (let i in consulta) {
                const html =
                    `<tr class="newRow" >
                 <td>${consulta[i].idcolegio}</td>
                 <td><form>
                     <div class="inputWrapper">
                     <input id=${consulta[i].idcolegio}  value="${consulta[i].nombre}">
                     </div >
                     </form>
                </td>
               <td class="centeredButtons">
                   <button onclick="editarCentre(${consulta[i].idcolegio})"  type="button" class="activeButton">EDITAR</button>
                   <button type="button" onclick="eliminarCentre(${consulta[i].idcolegio})"class="activeButton">ELIMINAR</button>
                </td>
               </tr>`;
                llistaCentres.insertAdjacentHTML('beforeEnd', html);
            }

        })
        .catch(e => { (console.log(e)) });
}


