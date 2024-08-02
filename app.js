import solicitud from "./modulos/ajax.js";
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

const cantidad = (elemento) => {
    let valor = elemento.value.length === 10;
    if (valor) {
        elemento.classList.remove("correcto")
        elemento.classList.add("error")
    }
}

const documentos = () => {
    const fragmento = document.createDocumentFragment()
    fetch(`http://127.0.0.1:3000/documents`)
      .then(response => response.json())
      .then((data)=> {
        data.forEach(element => {
        let option = document.createElement("option");
        option.value = element.id;
        option.textContent = element.name;
        fragmento.appendChild(option)
        });
        tipo_documento.appendChild(fragmento)
      });
}

const listar = () =>{
    let data = solicitud("users");
    console.log(data);;
}

//boton enviar hasta que se acepten las politicas
addEventListener("DOMContentLoaded",(event)=>{
    documentos();
    listar();
    //console.log(politicas.checked);
    if(!politicas.checked){
        // console.log(boton);
        button.setAttribute("disabled", "");
    }
});

politicas.addEventListener("change", function(e){
    console.log(e.target.checked);
    if (e.target.checked) {
        button.removeAttribute("disabled")
    }
});
$formulario.addEventListener("submit" , (event)=>{
    let response = is_valid(event, "form [required]");
    if (response) {
        const data ={
            first_name: nombre.value,
            last_name: tipo.value,
            address: direccion.value,
            type_id: tipo.value,
            email: correo.value,
            phone: telefono.value,
            document: documento.value,
        }
        fetch('http://localhost:3000/users',{
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => response.json())
        .then((json) => console.log(json));
    }else{
        alert("campos nulos")
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