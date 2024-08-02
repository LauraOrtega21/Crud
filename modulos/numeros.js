const numeros =(event) =>{
    if (event.keyCode < 48 || event.keyCode > 57) {
        event.preventDefault();
        // console.log("a");
    }
}

export default numeros;