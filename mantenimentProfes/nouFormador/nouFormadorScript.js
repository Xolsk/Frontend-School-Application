var isPassValid = false;

window.onload = () => {

    document.getElementById("contrassenya").oninput = handlePass;
    document.getElementById("contrassenyaConfirm").oninput = handlePass;
    document.getElementById("nomiCognom").oninput = validateInfo;
    document.getElementById("correu").oninput = validateInfo;
    document.getElementById("nomUsuari").oninput = validateInfo;
}

switchPass = () => {

    let currentState = document.getElementById("contrassenya").type;
    currentState === "password" ? (
        document.getElementById("eye").setAttribute("class", "active"),
        document.getElementById("contrassenya").setAttribute("type", "text"),
        document.getElementById("contrassenyaConfirm").setAttribute("type", "text"))
        : (document.getElementById("contrassenya").setAttribute("type", "password"),
            document.getElementById("contrassenyaConfirm").setAttribute("type", "password"),
            document.getElementById("eye").removeAttribute("class"))

}

//COMPROVA CORRECIó de CONTRASSENYA
handlePass = () => {
    let securityCheck = 0;
    let currentPass = document.getElementById("contrassenya").value;
    let passConfirm = document.getElementById("contrassenyaConfirm").value;
    if (currentPass.length >= 6) {
        securityCheck++
    }
    if (/[A-Z]/.test(currentPass) === true) {
        securityCheck++
    }
    if (/[a-z]/.test(currentPass) === true) {
        securityCheck++
    }
    if (/[0-9]/.test(currentPass) === true) {
        securityCheck++
    }
    if (securityCheck === 4) {
       document.getElementById("validaPass").innerHTML="És necessari que la contrassenya tingui 6 caràcters mínim i tingui un mínim de un número i una lletra majúscula. &#10003;";
       

    }
    else {
        isPassValid = false
        validateInfo();
        document.getElementById("validaPass").innerHTML = "És necessari que la contrassenya tingui 6 caràcters mínim i tingui un mínim de un número i una lletra majúscula."

    }
    if (currentPass === passConfirm && passConfirm != "") {
        document.getElementById("passMatch").innerHTML = "Les contrassenyes concorden."

    }
    else {
        if (passConfirm === "") {
            document.getElementById("passMatch").innerHTML = "Verifiqui que les contrassenyes concorden."
        }
        else {
            document.getElementById("passMatch").innerHTML = "Les contrassenyes no concorden."
            isPassValid = false;
            validateInfo();
        }
    }
    if (currentPass === passConfirm && securityCheck === 4) {

        isPassValid = true;
        validateInfo();

    }

}

//VALIDA INFOR FORMULARI

validateInfo = () => {

    formCheck = 0;
    let nomiCognom = document.getElementById("nomiCognom").value;
    let correu = document.getElementById("correu").value;
    let nomUsuari = document.getElementById("nomUsuari").value;
    if (nomiCognom != "") { formCheck++ }
    if (nomUsuari != "") { formCheck++ }
    expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (expr.test(correu)) {
         formCheck++;
         document.getElementById("validaCorreu").innerHTML="El correu ha de ser vàlid. &#10003;"
        }
    else{
        document.getElementById("validaCorreu").innerHTML="El correu ha de ser vàlid."
    }
    if (formCheck === 3 && isPassValid === true) {
        document.getElementById("enviar").className = "activeButton";
        document.getElementById("enviar").onclick = enviarDades;
        document.getElementById("enviar").removeAttribute("disabled");

    }
    else {
        document.getElementById("enviar").className = "inactiveButton";
        document.getElementById("enviar").setAttribute("disabled","true");
    }
}

//ENVIA DADES
enviarDades = () => {
    //RECOGER DATOS FORM
    event.preventDefault();
    let nombre = document.nouUsuari.nomiCognom.value;
    let usuario = document.nouUsuari.nomUsuari.value
    let tipo = "profesor";
    let email = document.nouUsuari.correu.value;
    let password = document.nouUsuari.contrassenya.value;

    //CREACION FORMDATA
    let nouUsuari = new FormData();
    nouUsuari.append("nombre", nombre);
    nouUsuari.append("usuario", usuario);
    nouUsuari.append("email", email);
    nouUsuari.append("password", password);
    nouUsuari.append("tipo", tipo);

    //ENVIO
    let params = {
        method: "post",
        body: nouUsuari,
        mode: "cors",
        cache: "no-cache"
    };
    fetch("http://alcyon-it.com/PQTM/pqtm_alta_profesores.php", params)
        .then(respuesta => {
            if (respuesta.ok) {
                return respuesta.text()
            }
            else { throw "Error en petición." }
        })
        .then(mensaje => {
            alert(mensaje);
            location.reload()
        })
        .catch(error => {
            console.log(error);
        })
}

