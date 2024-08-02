const solicitud = (url) => {
    fetch(`http://127.0.0.1:3000/${url}`)
      .then(response => response.json())
      .then(json => {
        return json}
    )};
        
export default solicitud