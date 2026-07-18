const tablaCertificaciones = document.getElementById("tblCertificaciones").querySelector("tbody");

async function cargarCertificaciones(){
    fetch("http://localhost:3000/certificaciones", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        } 
    }).then(response => response.json())
    .then(listaCertificaciones =>{
        tablaCertificaciones.innerHTML = ""; // Limpiar la tabla
        listaCertificaciones.forEach(certificacion =>{
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td> ${certificacion.nombre} </td>
                <td> ${certificacion.institucion} </td>
                <td> ${certificacion?.descripcion || ""}</td>
                <td> ${certificacion.vigencia.expira 
                    ? certificacion.vigencia.fechaExpiracion.split("T")[0] 
                    : "No expira"}</td>
            
            `;
            tablaCertificaciones.appendChild(fila); // Agregar la fila al final 
        }) 
    });
}

cargarCertificaciones();