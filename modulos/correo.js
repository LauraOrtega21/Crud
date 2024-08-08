// Validamos con la expresion regular como se debe aceptar el correo 

const isCorreo = (event, elemento) =>{
    let expresion = /^[\w-._+-]+@[\w-.-]+(\.[a-zA-Z]{2,3}){1,2}$/;
       //console.log(expresion, elemento.value);
       //console.log(expresion.test(elemento.value));
       if (expresion.test(elemento.value)) {
           elemento.classList.add("correcto")
           elemento.classList.remove("error")
       } else{
           // alert("No funciona")
           elemento.classList.add("error")
           elemento.classList.remove("correcto")
       }   
}

export default isCorreo;
