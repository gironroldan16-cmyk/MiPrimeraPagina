let formularioEnviado = false;



function saludar() {

  alert(
    "¡Felicidades! Tu JavaScript funciona."
  );

}



function prepararEnvio() {

  const formulario =
    document.getElementById(
      "formularioContacto"
    );


  if (!formulario.checkValidity()) {

    return;

  }


  formularioEnviado = true;


  const mensajeFormulario =
    document.getElementById(
      "mensajeFormulario"
    );


  mensajeFormulario.textContent =
    "Enviando mensaje...";

}



function confirmarEnvio() {

  if (!formularioEnviado) {

    return;

  }


  const nombre =
    document
      .getElementById("nombre")
      .value;


  const mensajeFormulario =
    document.getElementById(
      "mensajeFormulario"
    );


  mensajeFormulario.textContent =
    "¡Gracias " +
    nombre +
    "! Tu mensaje fue guardado correctamente.";


  document
    .getElementById(
      "formularioContacto"
    )
    .reset();


  formularioEnviado = false;

}