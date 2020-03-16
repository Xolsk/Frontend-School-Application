window.onload = () => {
    professorFetch(1,true)
    centresFetch();
}

centresFetch =()=>{

    fetch("http://alcyon-it.com/PQTM/pqtm_consulta_colegios.php")
    .then((respuesta => {
        if (respuesta.ok) {
            return respuesta.json();
        }
        else { throw "Error en petición." }
    }))
    .then(response => {
        let optionsNode= document.getElementById("colegio");
        for (i in response){
            let html=`<option id=col${response[i].idcolegio} value=${response[i].idcolegio}>${response[i].nombre}</option>`
            optionsNode.insertAdjacentHTML("beforeEnd",html)
        }
    })
    .catch(e=>{console.log(e)})
}
clearInfo = () => {
    let finished = false;
    while (finished === false) {
        document.getElementById("nouFormador").reset(); //ASSEGURA QUE BORREM TOT INPUT DEL USUARI.
        const active= document.querySelector(".selectedRow");
        if (active!=null){active.setAttribute("class", "newRow");}
        let previousTable = document.getElementsByClassName("newRow");
        for (row = previousTable.length - 1; row > -1; row--) {
            previousTable[row].remove()   //AQUI ARA TENIM BUIDA LA TAULA
        }
        document.querySelector("#eliminarFormador").setAttribute("disabled", "true");
        document.querySelector("#modificarFormador").setAttribute("disabled", "true");
        document.getElementById("eliminarFormador").setAttribute("class", "inactiveButton");
        document.getElementById("modificarFormador").setAttribute("class", "inactiveButton"); //ARA HEM DESACTIVAT ELS BOTONS
        let inputs = document.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {

            inputs[i].setAttribute("value", "");  //DEIXEM ELS VALUES NETS AL FORM
        }
        finished = true;
    }
    if (finished === true) {
        professorFetch(1, false);  //UN COP ESTEM SEGURS QUE ESTA TOT LO ANTERIOR FET; TORNEM A CRIDAR EL BACKEND.
    }
}
modificarFormador = () => {

    let id = document.getElementById("idKeeper").getAttribute("value");
    let newName = document.getElementById("nom").value;
    let newEmail = document.getElementById("email").value;
    let newUser = document.getElementById("usuari").value;
    let newTipus = document.getElementById("tipus").value;
    let colegio = document.getElementById("colegio").value;
      expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (newName.length >= 3 && newUser.length >= 3 && expr.test(newEmail) === true && colegio!="null") { //VALIDEM LES DADES
        let modProfe = new FormData();
        modProfe.append("idprofesor", id);
        modProfe.append("nombre", newName);
        modProfe.append("email", newEmail);
        modProfe.append("usuario", newUser);
        modProfe.append("tipo", newTipus);
        modProfe.append("colegio", colegio)
        let params = {
            method: "POST",
            body: modProfe,
            mode: "cors",
            cache: "no-cache"
        };
        fetch("http://alcyon-it.com/PQTM/pqtm_modificacion_profesores.php", params)
            .then((respuesta => {
                if (respuesta.ok) {
                    return respuesta.text();
                }
                else { throw "Error en petición." }
            }))
            .then(response => {
                alert(response);
                if (response === "MODIFICACIO EFECTUADA") {
                    clearInfo()
                }
            })
            .catch(error => { console.log(error) });
    } else {
        alert("Algun dels camps no està degudament emplenat. el Nom i l'Usuari han de tenir mínim tres caràcters i el correu ha de ser vàlid. Cal assignar un centre.")
    }
}


eliminarFormador = () => {

    let baixaConfirm = confirm("Un cop realitzada aquesta acció no es pot desfer. N'està segur/a?")
    if (baixaConfirm === true) {
        let id = document.getElementById("idKeeper").getAttribute("value");
        let baixaProfe = new FormData();
        baixaProfe.append("idprofesor", id);
        let params = {
            method: "POST",
            body: baixaProfe,
            mode: "cors",
            cache: "no-cache"
        };
        fetch("http://alcyon-it.com/PQTM/pqtm_baja_profesores.php", params)
            .then((respuesta => {
                if (respuesta.ok) {
                    return respuesta.text();

                }
                else { throw "Error en petición." }
            }))
            .then(response => {
                alert(response);
                if (response === "BAIXA COMPLETADA") {
                    clearInfo();
                }
            })
            .catch(error => { console.log(error) });
    }
}

consultaProfe = (idProfe) => {
    document.getElementById("nouFormador").reset();
    let previousSelection = document.querySelector(".selectedRow");
    if (previousSelection != null) previousSelection.setAttribute("class", "newRow");
    document.getElementById(idProfe).setAttribute("class", "selectedRow");

    let tipoconsulta = new FormData();
    tipoconsulta.append("tipoconsulta", "P");
    tipoconsulta.append("id", idProfe);

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
        .then(consulta => {
            if (consulta[0].idteacher != null) {
                document.getElementById("nom").setAttribute("value", consulta[0].nombre);
                document.getElementById("email").setAttribute("value", consulta[0].email);
                document.getElementById("usuari").setAttribute("value", consulta[0].user);
                document.getElementById("idKeeper").setAttribute("value", consulta[0].idteacher);
                if (document.getElementById(`col${consulta[0].colegio}`)!=null){
                 document.getElementById(`col${consulta[0].colegio}`).selected="selected";
                }
                else (alert("Aquest professor no té centre assignat. Es recomana modificar."))
                consulta[0].tipo === "AD" ?
                    document.getElementById("ad").selected = true
                    : document.getElementById("tc").selected = true;
                let inactiveButtons = document.querySelectorAll(".inactiveButton");
                for (let i = 0; i < inactiveButtons.length; i++) {
                    inactiveButtons[i].setAttribute("class", "activeButton");
                    inactiveButtons[i].removeAttribute("disabled");
                }
            }
            else { //POT SER QUE TINGUEM UNA LLISTA NO ACTUALITZADA PER LA ACCIO DE ALTRES USUARIS. AQUEST ELSE CUBREIX AIXO.
                alert("Aquest usuari ja no existeix.")
                clearInfo();
            }
        })
        .catch(error => {
            console.log(error);
        })

}

professorFetch = (pag,firstFetch) => {


    if (firstFetch===false){ //diferenciem el fetch inicial de posteriors, que necessitaran netejar la taula.
        let selected=document.querySelector(".selectedRow");
        if (selected!=null){selected.setAttribute("class", "newRow")};
        let previousTable = document.getElementsByClassName("newRow");
        parent=document.getElementById("paginacion")
        while (parent.firstChild) {
            parent.firstChild.remove();
        }
        for (row = previousTable.length - 1; row > -1; row--) {
            previousTable[row].remove()   //AQUI ARA TENIM BUIDA LA TAULA 
        }
    }
    let tipoconsulta = new FormData();
    tipoconsulta.append("tipoconsulta", "T");
    tipoconsulta.append("pag", pag)
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
        .then(consulta => {
            const profesores = consulta[0];
            const paginas = consulta[1]
            for (let i in profesores) {

                const llistaProfes = document.getElementById('llistaProfes');
                const html = `<tr class="newRow" id=${profesores[i].idteacher} onclick="consultaProfe(${profesores[i].idteacher})" ><td>${profesores[i].idteacher}  </td><td> ${profesores[i].nombre}  </td><td>${profesores[i].tipo} </td></tr>`;
                llistaProfes.insertAdjacentHTML('beforeEnd', html);
            };
            for (let i = 1; i <= paginas; i++) {
                const listado = document.getElementById("paginacion");

                const html = `<span id="pag${i}" onclick="professorFetch(${i},false)" class="index">${i}</span>`;
                listado.insertAdjacentHTML("beforeEnd", html);
            }
            document.getElementById("pag"+pag).setAttribute("class","activeIndex");
            sortTable(0);

        })
        .catch(error => {
            console.log(error);
        })

}

//POSICIONA CORRECTAMENT la fletxa
correctArrow = (n, dir) => {
    const arrow = "arr" + n;
    clearColumns = document.getElementsByClassName("arrow");

    for (let i in clearColumns) {
        clearColumns[i].innerHTML = " ";
    };
    currentColumn = document.getElementById(arrow);
    if (dir === "asc") {
        currentColumn.innerHTML = "&#x25BC";
    }
    if (dir === "desc") {
        currentColumn.innerHTML = "&#x25B2";
    }

}

//FUNCIÓ COPIADA DE W3SCHOOLS

sortTable = (n) => {

    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("llistaProfes");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";

    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows*/
        for (i = 0; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];

            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir == "asc") {
                if (n === 0) {
                    if (Number(x.innerHTML) > Number(y.innerHTML)) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
                else {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            else if (dir == "desc") {
                if (n === 0) {
                    if (Number(x.innerHTML) < Number(y.innerHTML)) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
                else {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
    correctArrow(n, dir)

}
