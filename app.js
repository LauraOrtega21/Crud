import solicitud from "./modulos/ajax.js";
import { URL } from "./modulos/config.js";
import isCorreo from "./modulos/correo.js";
import Sololetra from "./modulos/letras.js";
import numeros from "./modulos/numeros.js";
import remover from "./modulos/remover.js";
import is_valid from "./modulos/validar.js";



const $formulario = document.querySelector("form");
const nombre = document.querySelector("#nombre");
const apellido = document.querySelector("#apellido");
const telefono = document.querySelector("#telefono");
const direccion = document.querySelector("#direccion");
const tipo_documento = document.querySelector("#tipo_documento");
const documento = document.querySelector("#documento");
const politicas = document.querySelector("#politicas");
const correo = document.querySelector("#correo");
const button = document.querySelector("#button");
const tb_users = document.querySelector("#tb_users").content;
const fragmento = document.createDocumentFragment();
const tbody = document.querySelector("tbody");


console.log(tb_users);

const cantidad = (elemento) => {
    let value = elemento.value.length === 10;
    if (value) {
        elemento.classList.remove("correcto")
        elemento.classList.add("error")
    }else{
        elemento.classList.remove("error")
        elemento.classList.add("cantidad")
    }
}

const documentos = () => {
    const fragmento = document.createDocumentFragment()
    fetch(`${URL}/documents`)
      .then(response => response.json())
      .then((data)=> {
        let option = document.createElement("option")
        option.textContent = "Seleccione ...."
        option.value = "";
        fragmento.appendChild(option)
        data.forEach(element => {
        let option = document.createElement("option");
        option.value = element.id;
        option.textContent = element.name;
        fragmento.appendChild(option)
        });
        tipo_documento.appendChild(fragmento)
      });
}

const listar = async() => {
    const data = await solicitud("users");
    const documentos = await solicitud("documents")
    
    data.forEach(element =>{
        let nombre = documentos.find((documento) => documento.id === element.type_id).name;
        
        console.log(nombre);
        
        tb_users.querySelector(".nombre").textContent = element.first_name;
        tb_users.querySelector(".apellido").textContent = element.last_name;
        tb_users.querySelector(".direccion").textContent = element.address;
        tb_users.querySelector(".correo").textContent = element.email;
        tb_users.querySelector(".telefono").textContent = element.phone;
        tb_users.querySelector(".tipo_documento").textContent = nombre;
        tb_users.querySelector(".documento").textContent = element.document;

        tb_users.querySelector(".modificar").setAttribute("data-id",element.id)
        tb_users.querySelector(".eliminar").setAttribute("data-id",element.id)

        const clone =document.importNode(tb_users, true);
        fragmento.appendChild(clone);
    })
    tbody.appendChild(fragmento);

}

const createRow = (data) =>{
    const tr = tbody.insertRow(-1);

    const tdnombre = tr.insertCell(0);
    const tdapellido = tr.insertCell(1);
    const tddireccion = tr.insertCell(2);
    const tdcorreo = tr.insertCell(3);
    const tdtelefono = tr.insertCell(4);
    const tdtipo_doc = tr.insertCell(5);
    const tddocumento = tr.insertCell(6);

    tdnombre.textContent = data.first_name;
    tdapellido.textContent = data.last_name;
    tddireccion.textContent = data.address;
    tdcorreo.textContent = data.email;
    tdtelefono.textContent = data.phone;
    tdtipo_doc.textContent = data.type_id;
    tddocumento.textContent = data.document;
}

const buscar = (element) =>{
    console.log(element.dataset.id);
}

//boton enviar hasta que se acepten las politicaseListener("DOMContentLoadee)=>{
    documentos();
    listar();
    //console.log(politicas.checked);
    if(!politicas.checked){
        // console.log(boton);
        button.setAttribute("disabled", "");
    };

document.addEventListener("click", (e) =>{
    if (e.target.matches(".modificar")) {  
    buscar(e.target)  
    }
});

politicas.addEventListener("change", function(e){
    //console.log(e.target.checked);
    if (e.target.checked) {
        button.removeAttribute("disabled")
    }
});
$formulario.addEventListener("submit" , (event)=>{
    let response = is_valid(event, "form [required]");
    if (response) {
        const data ={
            first_name: nombre.value,
            last_name: apellido.value,
            address: direccion.value,
            type_id: tipo_documento.value,
            email: correo.value,
            phone: telefono.value,
            document: documento.value,
        }
        fetch(`${URL}/users`,{
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => response.json())
        .then((json) => {
            nombre.value = "";
            apellido.value = "";
            telefono.value = "";
            direccion.value = "";
            tipo_documento.selectedIndex = 0;
            documento.value = "";
            politicas.value = false;
            correo.value = "";

            createRow(json)

        });
    }else{
        alert("Campos Nulos")
    }
});

nombre.addEventListener("blur", (event) => {
    remover(event, nombre);
});
apellido.addEventListener("blur", (event) => {
    remover(event, apellido);
});
telefono.addEventListener("blur", (event) => {
    remover(event, telefono);
});
direccion.addEventListener("blur", (event) => {
    remover(event, direccion);
});
tipo_documento.addEventListener("blur", (event) => {
    remover(event, tipo_documento);
});
documento.addEventListener("blur", (event) => {
    remover(event, documento);
});
correo.addEventListener("blur", (event) => {
    remover(event, correo);
});


$formulario.addEventListener("submit", is_valid);
nombre.addEventListener("keydown", (event) => {
    remover(event, nombre);
});
apellido.addEventListener("keydown", (event) => {
    remover(event, apellido);
});
telefono.addEventListener("keydown", (event) => {
    remover(event, telefono);
});
direccion.addEventListener("keydown", (event) => {
    remover(event, direccion);
});
tipo_documento.addEventListener("keydown", (event) => {
    remover(event, tipo_documento);
});
documento.addEventListener("keydown", (event) => {
    remover(event, documento);
});

//boton enviar hasta que se acepten las politicas


documento.addEventListener("keypress", numeros)
telefono.addEventListener("keypress", numeros)
nombre.addEventListener("keypress", (event)=>{
    Sololetra(event, nombre)
});
apellido.addEventListener("keypress", (event)=>{
    Sololetra(event, apellido)
});
correo.addEventListener("blur", (event)=>{
    isCorreo(event, correo)
});