import { URL } from "./config.js";

const solicitud = async (url) => {
  let solicitud = await fetch (`${URL}/${url}`);
  let data = await solicitud.json();
  return data;
}

export const enviar = async (endpoint, options)=> {
  try{
    let solicitud = await fetch(`${URL}/${endpoint}`, options);
    let data = await solicitud.json();
    return data;
  } catch (error){
    return(error)
  };
}

export default solicitud