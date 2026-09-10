let formularioEnviado = false;


/* =========================================
   URL DEL BACKEND DE PLANTILLA
========================================= */

const URL_PLANTILLA =
  "https://script.google.com/macros/s/AKfycbyaZkfrmKI_kRTHV9h6Tu19hi5_56x1GxnVLF0dlutodoB7HQtSBGL1282Q-NZoCqmRVA/exec";



/* =========================================
   FORMULARIO DE CONTACTO
========================================= */

function prepararEnvio() {

  const formulario =
    document.getElementById(
      "formularioContacto"
    );


  if (!formulario) {
    return;
  }


  if (!formulario.checkValidity()) {
    return;
  }


  formularioEnviado = true;


  const mensajeFormulario =
    document.getElementById(
      "mensajeFormulario"
    );


  if (mensajeFormulario) {

    mensajeFormulario.textContent =
      "Enviando mensaje...";

  }

}



function confirmarEnvio() {

  if (!formularioEnviado) {
    return;
  }


  const campoNombre =
    document.getElementById(
      "nombre"
    );


  const mensajeFormulario =
    document.getElementById(
      "mensajeFormulario"
    );


  const formulario =
    document.getElementById(
      "formularioContacto"
    );


  if (
    !campoNombre ||
    !mensajeFormulario ||
    !formulario
  ) {

    return;

  }


  const nombre =
    campoNombre.value;


  mensajeFormulario.textContent =
    "¡Gracias " +
    nombre +
    "! Tu mensaje fue guardado correctamente.";


  formulario.reset();


  formularioEnviado = false;

}



/* =========================================
   CARGAR PLANTILLA DESDE GOOGLE SHEETS
========================================= */

function cargarPlantilla() {

  const grid =
    document.getElementById(
      "gridJugadoras"
    );


  /*
    Si no estamos en plantilla.html,
    no hacemos nada.
  */

  if (!grid) {
    return;
  }


  const estado =
    document.getElementById(
      "estadoPlantilla"
    );


  if (estado) {

    estado.textContent =
      "Cargando plantilla...";

  }


  /*
    Creamos un script temporal
    para consultar Apps Script.
  */

  const script =
    document.createElement(
      "script"
    );


  script.src =
    URL_PLANTILLA +
    "?callback=recibirPlantilla" +
    "&t=" +
    Date.now();


  script.onerror =
    function() {

      if (estado) {

        estado.textContent =
          "No fue posible cargar la plantilla.";

      }

    };


  document.body.appendChild(
    script
  );

}



/* =========================================
   RECIBIR DATOS DE GOOGLE SHEETS
========================================= */

function recibirPlantilla(respuesta) {

  const grid =
    document.getElementById(
      "gridJugadoras"
    );


  const estado =
    document.getElementById(
      "estadoPlantilla"
    );


  if (!grid) {
    return;
  }


  if (
    !respuesta ||
    respuesta.ok !== true
  ) {

    if (estado) {

      estado.textContent =
        "No fue posible cargar la plantilla.";

    }

    return;

  }


  const jugadores =
    respuesta.jugadores || [];


  grid.innerHTML = "";


  if (jugadores.length === 0) {

    if (estado) {

      estado.textContent =
        "No hay jugadores registrados.";

    }

    return;

  }


  jugadores.forEach(
    function(jugador) {

      const tarjeta =
        crearTarjetaJugador(
          jugador
        );


      grid.appendChild(
        tarjeta
      );

    }
  );


  if (estado) {

    estado.textContent = "";

  }

}



/* =========================================
   CREAR TARJETA DE JUGADOR
========================================= */

function crearTarjetaJugador(
  jugador
) {

  const tarjeta =
    document.createElement(
      "article"
    );


  tarjeta.className =
    "jugadora-card";


  const posicionNormalizada =
    normalizarPosicion(
      jugador.posicion
    );


  tarjeta.dataset.posicion =
    posicionNormalizada;



  /* FOTO */

  const contenedorFoto =
    document.createElement(
      "div"
    );


  contenedorFoto.className =
    "jugadora-foto";


  const urlFoto =
    convertirLinkDrive(
      jugador.foto
    );


  if (urlFoto) {

    const imagen =
      document.createElement(
        "img"
      );


    imagen.src =
      urlFoto;


    imagen.alt =
      jugador.nombre;


    imagen.onerror =
      function() {

        imagen.remove();


        const placeholder =
          crearPlaceholder();


        contenedorFoto.prepend(
          placeholder
        );

      };


    contenedorFoto.appendChild(
      imagen
    );

  } else {

    contenedorFoto.appendChild(
      crearPlaceholder()
    );

  }



  /* DORSAL */

  const dorsal =
    document.createElement(
      "span"
    );


  dorsal.className =
    "dorsal";


  dorsal.textContent =
    formatearDorsal(
      jugador.dorsal
    );


  contenedorFoto.appendChild(
    dorsal
  );



  /* INFORMACIÓN */

  const informacion =
    document.createElement(
      "div"
    );


  informacion.className =
    "jugadora-info";


  const posicion =
    document.createElement(
      "p"
    );


  posicion.className =
    "posicion";


  posicion.textContent =
    jugador.posicion;


  const nombre =
    document.createElement(
      "h2"
    );


  nombre.textContent =
    jugador.nombre;


  informacion.appendChild(
    posicion
  );


  informacion.appendChild(
    nombre
  );



  /* ARMAR TARJETA */

  tarjeta.appendChild(
    contenedorFoto
  );


  tarjeta.appendChild(
    informacion
  );


  return tarjeta;

}



/* =========================================
   PLACEHOLDER CUANDO NO HAY FOTO
========================================= */

function crearPlaceholder() {

  const placeholder =
    document.createElement(
      "div"
    );


  placeholder.className =
    "foto-placeholder";


  placeholder.textContent =
    "FOTO";


  return placeholder;

}



/* =========================================
   CONVERTIR LINK DE GOOGLE DRIVE
========================================= */

function convertirLinkDrive(url) {

  if (!url) {
    return "";
  }


  /*
    Convierte:

    https://drive.google.com/file/d/ID/view

    en una URL apta para <img>
  */

  const coincidencia =
    url.match(
      /\/file\/d\/([^/]+)/
    );


  if (coincidencia) {

    const id =
      coincidencia[1];


    return (
      "https://drive.google.com/thumbnail" +
      "?id=" +
      id +
      "&sz=w1000"
    );

  }


  return url;

}



/* =========================================
   FORMATEAR DORSAL
========================================= */

function formatearDorsal(
  dorsal
) {

  if (!dorsal) {
    return "";
  }


  return String(
    dorsal
  ).padStart(
    2,
    "0"
  );

}



/* =========================================
   NORMALIZAR POSICIÓN
========================================= */

function normalizarPosicion(
  posicion
) {

  if (!posicion) {
    return "";
  }


  return posicion
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );

}



/* =========================================
   FILTROS DE LA PLANTILLA
========================================= */

function filtrarJugadoras(
  posicion,
  boton
) {

  const jugadoras =
    document.querySelectorAll(
      ".jugadora-card"
    );


  const botones =
    document.querySelectorAll(
      ".filtro-btn"
    );


  botones.forEach(
    function(btn) {

      btn.classList.remove(
        "activo"
      );

    }
  );


  if (boton) {

    boton.classList.add(
      "activo"
    );

  }


  jugadoras.forEach(
    function(jugadora) {

      const posicionJugadora =
        jugadora.dataset.posicion;


      if (
        posicion === "todas" ||
        posicionJugadora === posicion
      ) {

        jugadora.style.display =
          "block";

      } else {

        jugadora.style.display =
          "none";

      }

    }
  );

}



/* =========================================
   AL CARGAR LA PÁGINA
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    cargarPlantilla();

  }
);