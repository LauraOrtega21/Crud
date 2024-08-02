const dom = document;
// Validamos que solo ingrese letras y no los numeros 

const Sololetra = (event) => {
    let letras = /^[a-zA-ZÀ-ÿ\s]+$/;
    if (letras.test(event.key)) {
        // console.log("sí");
    } else {
        event.preventDefault();
    }
};

export default Sololetra;
