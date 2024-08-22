import solicitud, { enviar } from "./modulos/ajax.js";
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
const user = document.querySelector("#user");


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

const listar = async(page) => {
    const _page = page ? page : 1;
    const data = await solicitud(`users?_page=${_page}&_per_page=8`);
    const documentos = await solicitud("documents")
    
    const nav = document.querySelector(".navegacion");
    const first = data.first;
    const prev = data.prev;
    const next = data.next;
    const last = data.last;

    nav.querySelector(".first").disabled = first ? false : true;
    nav.querySelector(".prev").disabled = prev ? false : true;
    nav.querySelector(".next").disabled = next ? false : true;
    nav.querySelector(".last").disabled = last ? false : true;

    nav.querySelector(".first").setAttribute("data-first", first);
    nav.querySelector(".prev").setAttribute("data-prev", prev);
    nav.querySelector(".next").setAttribute("data-next", next);
    nav.querySelector(".last").setAttribute("data-last", last)
    

console.log(data);

console.log(nav);


    
    

    data.data.forEach(element =>{
        let nombre = documentos.find((documento) => documento.id === element.type_id).name;
        
        // tb_users.querySelector("tr").setAttribute("id", `user_${element.id}`)
        tb_users.querySelector("tr").id = `user_${element.id}`;
        
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

const buscar = async(element) =>{
   const data = await enviar(`users/${element.dataset.id}`, //endpoint
    {
        method: "PATCH",
        headers:{
            'Content-type': 'application/json; charset=UTF-8',
        }
    });
    loadForm(data)
}

const save = (event) =>  {
    let response = is_valid(event, "form [required]");
    const data ={
        first_name: nombre.value,
        last_name: apellido.value,
        address: direccion.value,
        type_id: tipo_documento.value,
        email: correo.value,
        phone: telefono.value,
        document: documento.value,
        }
        if (response) {
            if(user.value === ""){
                guardar(data)
            }else{
                actualizar(data)
                console.log(document);
                
            }
            
        }
}





const guardar = (data) => {
    fetch(`${URL}/users`,{
            method: "Post",
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


            limpiarForm()

            createRow(json)

        });
}
    


const actualizar = async (data) => {
    const response = await enviar(`users/${user.value}`,{
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
    'Content-type': 'application/json; charset=UTF-8',
    }
    });
    limpiarForm()
    ediRow(response)
    
}

const limpiarForm = () => {
    nombre.value = "";
    apellido.value = "";
    telefono.value = "";
    direccion.value = "";
    correo.value = "";
    tipo_documento.value = "";
    documento.value = "";
    politicas.checked = false;
    button.removeAttribute ("disabled")
}

const ediRow = async (data) => {
    const documentos = await solicitud("documents")
    let nombre = documentos.find((documento)=> documento.id === data.type_id). name
    const tr = document.querySelector(`#user_${data.id}`)
    // nombre = tr.querySelector(".nombre");
   tr.querySelector(".nombre").textContent = data.first_name;
   tr.querySelector(".apellido").textContent = data.last_name;
   tr.querySelector(".direccion").textContent = data.address;
   tr.querySelector(".tipo_documento").textContent = nombre;
   tr.querySelector(".correo").textContent = data.email;
   tr.querySelector(".telefono").textContent = data.phone;
   tr.querySelector(".documento").textContent = data.document;
   
};

const loadForm = (data) => {
    const {
        id,
        first_name,
        last_name,
        phone,
        address,
        email,
        type_id,
        document,
    } =  data;

    user.value = id;
    nombre.value = data.first_name;
    apellido.value = data.last_name;
    telefono.value = data.phone;
    direccion.value = data.address;
    correo.value = data.email;
    tipo_documento.value = data.type_id;
    documento.value = data.document;
    politicas.checked = true;
    button.removeAttribute("disabled", "")
}

const eliminar = async (element) => {
    let id = element.dataset.id;
    const tr = document-querySelector(`#users_${id}`);
    const username = tr.querySelector(".nombre").textContent;
    const confirmdelete = confirm(`Desea eliminar al usuario ${username} ?`);

    if (confirmdelete) {
        const response = await enviar(`${URL}/users/${id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
    });
    }
    tr.remove()
    
    
}

//boton enviar hasta que se acepten las politicaseListener("DOMContentLoadee)=>{
    


 
addEventListener("DOMContentLoaded", (event) => {
    documentos();
    listar();
    //console.log(politicas.checked);
    if(!politicas.checked){
        // console.log(boton);
        button.setAttribute("disabled", "");
    };
})   

document.addEventListener("click", (e) =>{
    if (e.target.matches(".modificar")) {  
    buscar(e.target)  
    }

    if (e.target.matches(".eliminar")) {
    eliminar(e.target)
    }

    if (e.target.matches(".first")) {
        const nodos = tbody;
        const first = e.target.dataset.first
        console.log(first);
        
        while(nodos.firstChild){
            nodos.removeChild(nodos.firstChild)
        }
        listar(first)
    }

    if (e.target.matches(".prev")) {
        const nodos = tbody;
        const prev = e.target.dataset.prev
        console.log(prev);
        
        while(nodos.firstChild){
            nodos.removeChild(nodos.firstChild)
        }
        listar(prev)
    }

    if (e.target.matches(".next")) {
        const nodos = tbody;
        const next = e.target.dataset.next
        console.log(next);
        
        while(nodos.firstChild){
            nodos.removeChild(nodos.firstChild)
        }
        listar(next)
    }

    if (e.target.matches(".last")) {
        const nodos = tbody;
        const last = e.target.dataset.last
        console.log(last);
        

        while(nodos.firstChild){
            nodos.removeChild(nodos.firstChild)
        }
        listar(last)
    }
}
);

politicas.addEventListener("change", function(e){
    //console.log(e.target.checked);
    if (e.target.checked) {
        button.removeAttribute("disabled")
    }
});
$formulario.addEventListener("submit" , save);

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