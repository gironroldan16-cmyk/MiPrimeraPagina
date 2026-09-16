let formularioEnviado = false;


/* =========================================
   URL DEL BACKEND
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
   CARGAR PLANTILLA
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
   RECIBIR PLANTILLA
========================================= */

function recibirPlantilla(
  respuesta
) {

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

  if (
    jugadores.length === 0
  ) {

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


  tarjeta.appendChild(
    contenedorFoto
  );

  tarjeta.appendChild(
    informacion
  );


  return tarjeta;

}


/* =========================================
   PLACEHOLDER
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

function convertirLinkDrive(
  url
) {

  if (!url) {
    return "";
  }


  const texto =
    String(url).trim();


  let id = "";


  /*
    Formato:

    https://drive.google.com/file/d/ID/view
  */

  let coincidencia =
    texto.match(
      /\/file\/d\/([^/?]+)/
    );


  if (coincidencia) {

    id =
      coincidencia[1];

  }


  /*
    Formatos:

    https://drive.google.com/open?id=ID

    https://drive.google.com/uc?id=ID
  */

  if (!id) {

    coincidencia =
      texto.match(
        /[?&]id=([^&]+)/
      );


    if (coincidencia) {

      id =
        coincidencia[1];

    }

  }


  /*
    Si solo colocamos el ID.
  */

  if (
    !id &&
    /^[a-zA-Z0-9_-]+$/.test(
      texto
    )
  ) {

    id =
      texto;

  }


  if (id) {

    return (
      "https://drive.google.com/thumbnail" +
      "?id=" +
      encodeURIComponent(id) +
      "&sz=w1600"
    );

  }


  return texto;

}

/* =========================================
   FORMATEAR DORSAL
========================================= */

function formatearDorsal(
  dorsal
) {

  if (
    dorsal === null ||
    dorsal === undefined ||
    dorsal === ""
  ) {

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
   NORMALIZAR TEXTO
========================================= */

function normalizarTexto(
  texto
) {

  if (!texto) {
    return "";
  }

  return String(texto)
    .toLowerCase()
    .trim()
    .normalize(
      "NFD"
    )
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(
      /\s+/g,
      " "
    );

}


/* =========================================
   NORMALIZAR POSICIÓN
========================================= */

function normalizarPosicion(
  posicion
) {

  const valor =
    normalizarTexto(
      posicion
    );


  if (
    valor === "portero" ||
    valor === "porteros"
  ) {

    return "portero";

  }


  if (
    valor === "defensa lateral" ||
    valor === "defensas laterales"
  ) {

    return "defensa-lateral";

  }


  if (
    valor === "defensa central" ||
    valor === "defensas centrales"
  ) {

    return "defensa-central";

  }


  if (
    valor === "volante interior" ||
    valor === "volantes interiores"
  ) {

    return "volante-interior";

  }


  if (
    valor === "volante central" ||
    valor === "volantes centrales"
  ) {

    return "volante-central";

  }


  if (
    valor === "volante extremo" ||
    valor === "volantes extremos"
  ) {

    return "volante-extremo";

  }


  if (
    valor === "contencion" ||
    valor === "contenciones"
  ) {

    return "contencion";

  }


  if (
    valor === "centro delantero" ||
    valor === "centro delanteros" ||
    valor === "centros delanteros"
  ) {

    return "centro-delantero";

  }


  return valor.replace(
    /\s+/g,
    "-"
  );

}


/* =========================================
   FILTROS DE PLANTILLA
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


/* =========================================================
   FOTOS
   ========================================================= */

let fotosGaleriaActual = [];

let indiceGaleriaActual = 0;

let scriptGaleriaActual = null;


/* =========================================================
   CARGAR PARTIDOS
   ========================================================= */

function cargarFotos() {

  const listaPartidos =
    document.getElementById(
      "listaPartidos"
    );

  /*
    Si no estamos en fotos.html,
    no hacemos nada.
  */

  if (!listaPartidos) {
    return;
  }


  mostrarEstadoFotos(
    "Galería de partidos",
    "Cargando partidos..."
  );


  const script =
    document.createElement(
      "script"
    );


  script.src =
    URL_PLANTILLA +
    "?tipo=fotos" +
    "&callback=recibirFotos" +
    "&t=" +
    Date.now();


  script.onerror =
    function() {

      mostrarEstadoFotos(
        "Galería de partidos",
        "No fue posible cargar los partidos."
      );

    };


  document.body.appendChild(
    script
  );

}


/* =========================================================
   RECIBIR PARTIDOS
   ========================================================= */

function recibirFotos(
  respuesta
) {

  const listaPartidos =
    document.getElementById(
      "listaPartidos"
    );


  if (!listaPartidos) {
    return;
  }


  if (
    !respuesta ||
    respuesta.ok !== true
  ) {

    mostrarEstadoFotos(
      "Galería de partidos",
      "No fue posible cargar los partidos."
    );

    return;

  }


  const partidos =
    respuesta.partidos || [];


  if (
    partidos.length === 0
  ) {

    mostrarEstadoFotos(
      "Galería de partidos",
      "Muy pronto podrás encontrar aquí las fotografías de cada encuentro de UDA."
    );

    return;

  }


  listaPartidos.innerHTML = "";


  const grid =
    document.createElement(
      "div"
    );

  grid.className =
    "grid-partidos";


  partidos.forEach(
    function(partido) {

      const tarjeta =
        crearTarjetaPartido(
          partido
        );

      grid.appendChild(
        tarjeta
      );

    }
  );


  listaPartidos.appendChild(
    grid
  );

}


/* =========================================================
   CREAR TARJETA DE PARTIDO
   ========================================================= */

   function crearTarjetaPartido(
  partido
) {

  const tarjeta =
    document.createElement(
      "article"
    );


  tarjeta.className =
    "partido-card";



  /* =====================================================
     PORTADA
     ===================================================== */

  const portada =
    document.createElement(
      "div"
    );


  portada.className =
    "partido-portada";


  const imagen =
    document.createElement(
      "img"
    );


  const portadaConvertida =
    convertirLinkDrive(
      partido.portada
    );


  imagen.src =
    portadaConvertida ||
    "imagenes/Portada.png";


  imagen.alt =
    partido.partido ||
    "Partido UDA";


  imagen.onerror =
    function() {

      if (
        imagen.getAttribute(
          "data-fallback"
        ) === "si"
      ) {

        return;

      }


      console.log(
        "No se pudo cargar la portada:",
        portadaConvertida
      );


      imagen.setAttribute(
        "data-fallback",
        "si"
      );


      imagen.src =
        "imagenes/Portada.png";

    };


  portada.appendChild(
    imagen
  );



  /* =====================================================
     INFORMACIÓN
     ===================================================== */

  const informacion =
    document.createElement(
      "div"
    );


  informacion.className =
    "partido-info";



  /* FECHA */

  const fecha =
    document.createElement(
      "span"
    );


  fecha.className =
    "partido-fecha";


  fecha.textContent =
    formatearFechaPartido(
      partido.fecha
    );



  /* JORNADA */

  const jornada =
    document.createElement(
      "span"
    );


  jornada.className =
    "partido-jornada";


  jornada.textContent =
    partido.jornada ||
    "";



  /* TÍTULO */

  const titulo =
    document.createElement(
      "h3"
    );


  titulo.textContent =
    partido.partido ||
    "Partido UDA";



  /* DESCRIPCIÓN */

  const descripcion =
    document.createElement(
      "p"
    );


  descripcion.textContent =
    partido.descripcion ||
    "Revive los mejores momentos de este encuentro.";



  /* BOTÓN */

  const boton =
    document.createElement(
      "button"
    );


  boton.className =
    "partido-boton";


  boton.type =
    "button";


  boton.textContent =
    "Ver fotos";


  boton.addEventListener(

    "click",

    function() {

      abrirFotosPartido(
        partido
      );

    }

  );



  /* =====================================================
     ARMAR INFORMACIÓN
     ===================================================== */

  informacion.appendChild(
    fecha
  );


  if (
    partido.jornada &&
    String(
      partido.jornada
    ).trim() !== ""
  ) {

    informacion.appendChild(
      jornada
    );

  }


  informacion.appendChild(
    titulo
  );


  informacion.appendChild(
    descripcion
  );


  informacion.appendChild(
    boton
  );



  /* =====================================================
     ARMAR TARJETA
     ===================================================== */

  tarjeta.appendChild(
    portada
  );


  tarjeta.appendChild(
    informacion
  );


  return tarjeta;

}

/* =========================================================
   ABRIR GALERÍA DEL PARTIDO
   ========================================================= */

function abrirFotosPartido(
  partido
) {

  if (
    !partido ||
    !partido.id
  ) {

    return;

  }


  mostrarModalGaleriaCarga(
    partido
  );


  limpiarScriptGaleria();


  const script =
    document.createElement(
      "script"
    );


  scriptGaleriaActual =
    script;


  script.src =
    URL_PLANTILLA +
    "?tipo=galeria" +
    "&id=" +
    encodeURIComponent(
      partido.id
    ) +
    "&callback=recibirGaleriaPartido" +
    "&t=" +
    Date.now();


  script.onerror =
    function() {

      limpiarScriptGaleria();

      mostrarErrorGaleria(
        "No fue posible cargar las fotografías de este partido."
      );

    };


  document.body.appendChild(
    script
  );

}


/* =========================================================
   RECIBIR GALERÍA
   ========================================================= */

function recibirGaleriaPartido(
  respuesta
) {

  limpiarScriptGaleria();


  if (
    !respuesta ||
    respuesta.ok !== true
  ) {

    mostrarErrorGaleria(
      respuesta &&
      respuesta.mensaje
        ? respuesta.mensaje
        : "No fue posible cargar las fotografías de este partido."
    );

    return;

  }


  const partido =
    respuesta.partido || {};


  const fotos =
    respuesta.fotos || [];


  const titulo =
    document.getElementById(
      "galeriaTitulo"
    );


  const fecha =
    document.getElementById(
      "galeriaFecha"
    );


  const jornada =
    document.getElementById(
      "galeriaJornada"
    );


  const estado =
    document.getElementById(
      "galeriaEstado"
    );


  const grid =
    document.getElementById(
      "galeriaGrid"
    );


  if (
    !titulo ||
    !fecha ||
    !jornada ||
    !estado ||
    !grid
  ) {

    return;

  }


  titulo.textContent =
    partido.partido ||
    "Galería UDA";


  fecha.textContent =
    formatearFechaPartido(
      partido.fecha
    );


  /* JORNADA */

  if (
    partido.jornada &&
    String(
      partido.jornada
    ).trim() !== ""
  ) {

    jornada.textContent =
      partido.jornada;

    jornada.style.display =
      "inline-flex";

  } else {

    jornada.textContent =
      "";

    jornada.style.display =
      "none";

  }


  grid.innerHTML = "";


  if (
    fotos.length === 0
  ) {

    estado.classList.remove(
      "galeria-estado-error"
    );

    estado.textContent =
      "Todavía no hay fotografías disponibles para este encuentro.";

    estado.style.display =
      "flex";

    fotosGaleriaActual = [];

    return;

  }


  estado.style.display =
    "none";


  fotosGaleriaActual =
    fotos;


  fotos.forEach(

    function(
      foto,
      indice
    ) {

      const boton =
        document.createElement(
          "button"
        );


      boton.type =
        "button";


      boton.className =
        "galeria-foto-item";


      boton.setAttribute(
        "aria-label",
        "Abrir fotografía " +
        (indice + 1)
      );


      const imagen =
        document.createElement(
          "img"
        );


      imagen.src =
        foto.miniatura;


      imagen.alt =
        foto.nombre ||
        "Fotografía del partido";


      imagen.loading =
        "lazy";


      imagen.onerror =
        function() {

          boton.classList.add(
            "galeria-foto-error"
          );


          imagen.style.display =
            "none";


          if (
            !boton.querySelector(
              ".galeria-foto-error-texto"
            )
          ) {

            const textoError =
              document.createElement(
                "span"
              );


            textoError.className =
              "galeria-foto-error-texto";


            textoError.textContent =
              "Foto no disponible";


            boton.appendChild(
              textoError
            );

          }

        };


      boton.addEventListener(

        "click",

        function() {

          abrirVisorFoto(
            indice
          );

        }

      );


      boton.appendChild(
        imagen
      );


      grid.appendChild(
        boton
      );

    }

  );

}

/* =========================================================
   CREAR MODAL DE GALERÍA
   ========================================================= */

function crearModalGaleria() {

  if (
    document.getElementById(
      "modalGaleria"
    )
  ) {

    return;

  }


  const modal =
    document.createElement(
      "div"
    );


  modal.id =
    "modalGaleria";


  modal.className =
    "galeria-modal";


  modal.setAttribute(
    "aria-hidden",
    "true"
  );



  /* FONDO */

  const fondo =
    document.createElement(
      "div"
    );


  fondo.className =
    "galeria-modal-fondo";


  fondo.addEventListener(

    "click",

    function() {

      cerrarGaleriaPartido();

    }

  );



  /* CONTENIDO */

  const contenido =
    document.createElement(
      "section"
    );


  contenido.className =
    "galeria-modal-contenido";


  contenido.setAttribute(
    "role",
    "dialog"
  );


  contenido.setAttribute(
    "aria-modal",
    "true"
  );


  contenido.setAttribute(
    "aria-labelledby",
    "galeriaTitulo"
  );



  /* CABECERA */

  const cabecera =
    document.createElement(
      "header"
    );


  cabecera.className =
    "galeria-modal-cabecera";



  const textos =
    document.createElement(
      "div"
    );


  textos.className =
    "galeria-modal-textos";



  /* ETIQUETA */

  const etiqueta =
    document.createElement(
      "span"
    );


  etiqueta.className =
    "galeria-modal-etiqueta";


  etiqueta.textContent =
    "GALERÍA DEL PARTIDO";



  /* TÍTULO */

  const titulo =
    document.createElement(
      "h2"
    );


  titulo.id =
    "galeriaTitulo";


  titulo.textContent =
    "Galería UDA";



  /* FECHA */

  const fecha =
    document.createElement(
      "span"
    );


  fecha.id =
    "galeriaFecha";


  fecha.className =
    "galeria-modal-fecha";



  /* JORNADA */

  const jornada =
    document.createElement(
      "span"
    );


  jornada.id =
    "galeriaJornada";


  jornada.className =
    "galeria-modal-jornada";



  /* BOTÓN CERRAR */

  const cerrar =
    document.createElement(
      "button"
    );


  cerrar.type =
    "button";


  cerrar.className =
    "galeria-cerrar";


  cerrar.setAttribute(
    "aria-label",
    "Cerrar galería"
  );


  cerrar.textContent =
    "×";


  cerrar.addEventListener(

    "click",

    function() {

      cerrarGaleriaPartido();

    }

  );



  /* ARMAR TEXTOS */

  textos.appendChild(
    etiqueta
  );


  textos.appendChild(
    titulo
  );


  textos.appendChild(
    fecha
  );


  textos.appendChild(
    jornada
  );



  cabecera.appendChild(
    textos
  );


  cabecera.appendChild(
    cerrar
  );



  /* CUERPO */

  const cuerpo =
    document.createElement(
      "div"
    );


  cuerpo.className =
    "galeria-modal-cuerpo";



  const estado =
    document.createElement(
      "div"
    );


  estado.id =
    "galeriaEstado";


  estado.className =
    "galeria-estado";



  const grid =
    document.createElement(
      "div"
    );


  grid.id =
    "galeriaGrid";


  grid.className =
    "galeria-grid";



  cuerpo.appendChild(
    estado
  );


  cuerpo.appendChild(
    grid
  );


  contenido.appendChild(
    cabecera
  );


  contenido.appendChild(
    cuerpo
  );


  modal.appendChild(
    fondo
  );


  modal.appendChild(
    contenido
  );


  document.body.appendChild(
    modal
  );


  crearVisorGaleria();

}


/* =========================================================
   MOSTRAR MODAL CARGANDO
   ========================================================= */

function mostrarModalGaleriaCarga(
  partido
) {

  crearModalGaleria();


  const modal =
    document.getElementById(
      "modalGaleria"
    );


  const titulo =
    document.getElementById(
      "galeriaTitulo"
    );


  const fecha =
    document.getElementById(
      "galeriaFecha"
    );


  const jornada =
    document.getElementById(
      "galeriaJornada"
    );


  const estado =
    document.getElementById(
      "galeriaEstado"
    );


  const grid =
    document.getElementById(
      "galeriaGrid"
    );


  if (
    !modal ||
    !titulo ||
    !fecha ||
    !jornada ||
    !estado ||
    !grid
  ) {

    return;

  }


  titulo.textContent =
    partido.partido ||
    "Galería UDA";


  fecha.textContent =
    formatearFechaPartido(
      partido.fecha
    );


  if (
    partido.jornada &&
    String(
      partido.jornada
    ).trim() !== ""
  ) {

    jornada.textContent =
      partido.jornada;

    jornada.style.display =
      "inline-flex";

  } else {

    jornada.textContent =
      "";

    jornada.style.display =
      "none";

  }


  estado.classList.remove(
    "galeria-estado-error"
  );


  estado.textContent =
    "Cargando fotografías...";


  estado.style.display =
    "flex";


  grid.innerHTML = "";


  fotosGaleriaActual = [];


  modal.classList.add(
    "galeria-modal-activa"
  );


  modal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.classList.add(
    "galeria-abierta"
  );

}


/* =========================================================
   MOSTRAR ERROR DE GALERÍA
   ========================================================= */

function mostrarErrorGaleria(
  mensaje
) {

  const estado =
    document.getElementById(
      "galeriaEstado"
    );


  const grid =
    document.getElementById(
      "galeriaGrid"
    );


  if (grid) {

    grid.innerHTML = "";

  }


  if (estado) {

    estado.classList.add(
      "galeria-estado-error"
    );

    estado.textContent =
      mensaje;

    estado.style.display =
      "flex";

  }

}


/* =========================================================
   CERRAR GALERÍA
   ========================================================= */

function cerrarGaleriaPartido() {

  cerrarVisorFoto();


  const modal =
    document.getElementById(
      "modalGaleria"
    );


  if (!modal) {
    return;
  }


  modal.classList.remove(
    "galeria-modal-activa"
  );


  modal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.classList.remove(
    "galeria-abierta"
  );


  fotosGaleriaActual = [];


  limpiarScriptGaleria();

}


/* =========================================================
   LIMPIAR SCRIPT JSONP
   ========================================================= */

function limpiarScriptGaleria() {

  if (
    scriptGaleriaActual &&
    scriptGaleriaActual.parentNode
  ) {

    scriptGaleriaActual.parentNode.removeChild(
      scriptGaleriaActual
    );

  }


  scriptGaleriaActual = null;

}


/* =========================================================
   CREAR VISOR DE FOTOGRAFÍAS
   ========================================================= */

function crearVisorGaleria() {

  if (
    document.getElementById(
      "visorGaleria"
    )
  ) {

    return;

  }


  const visor =
    document.createElement(
      "div"
    );

  visor.id =
    "visorGaleria";

  visor.className =
    "galeria-visor";

  visor.setAttribute(
    "aria-hidden",
    "true"
  );


  const fondo =
    document.createElement(
      "div"
    );

  fondo.className =
    "galeria-visor-fondo";


  fondo.addEventListener(
    "click",
    function() {

      cerrarVisorFoto();

    }
  );


  const cerrar =
    document.createElement(
      "button"
    );

  cerrar.type =
    "button";

  cerrar.className =
    "visor-cerrar";

  cerrar.setAttribute(
    "aria-label",
    "Cerrar fotografía"
  );

  cerrar.textContent =
    "×";


  cerrar.addEventListener(
    "click",
    function() {

      cerrarVisorFoto();

    }
  );


  const anterior =
    document.createElement(
      "button"
    );

  anterior.type =
    "button";

  anterior.className =
    "visor-anterior";

  anterior.setAttribute(
    "aria-label",
    "Fotografía anterior"
  );

  anterior.textContent =
    "‹";


  anterior.addEventListener(
    "click",
    function() {

      cambiarFotoGaleria(
        -1
      );

    }
  );


  const siguiente =
    document.createElement(
      "button"
    );

  siguiente.type =
    "button";

  siguiente.className =
    "visor-siguiente";

  siguiente.setAttribute(
    "aria-label",
    "Fotografía siguiente"
  );

  siguiente.textContent =
    "›";


  siguiente.addEventListener(
    "click",
    function() {

      cambiarFotoGaleria(
        1
      );

    }
  );


  const contenido =
    document.createElement(
      "div"
    );

  contenido.className =
    "visor-contenido";


  const imagen =
    document.createElement(
      "img"
    );

  imagen.id =
    "visorImagen";

  imagen.alt =
    "Fotografía del partido";


  const contador =
    document.createElement(
      "div"
    );

  contador.id =
    "visorContador";

  contador.className =
    "visor-contador";


  contenido.appendChild(
    imagen
  );

  contenido.appendChild(
    contador
  );


  visor.appendChild(
    fondo
  );

  visor.appendChild(
    cerrar
  );

  visor.appendChild(
    anterior
  );

  visor.appendChild(
    contenido
  );

  visor.appendChild(
    siguiente
  );


  document.body.appendChild(
    visor
  );

}


/* =========================================================
   ABRIR FOTO GRANDE
   ========================================================= */

function abrirVisorFoto(
  indice
) {

  if (
    !fotosGaleriaActual.length
  ) {

    return;

  }


  indiceGaleriaActual =
    indice;


  actualizarVisorFoto();


  const visor =
    document.getElementById(
      "visorGaleria"
    );


  if (!visor) {
    return;
  }


  visor.classList.add(
    "galeria-visor-activo"
  );


  visor.setAttribute(
    "aria-hidden",
    "false"
  );

}


/* =========================================================
   CERRAR FOTO GRANDE
   ========================================================= */

function cerrarVisorFoto() {

  const visor =
    document.getElementById(
      "visorGaleria"
    );


  if (!visor) {
    return;
  }


  visor.classList.remove(
    "galeria-visor-activo"
  );


  visor.setAttribute(
    "aria-hidden",
    "true"
  );

}


/* =========================================================
   CAMBIAR FOTO
   ========================================================= */

function cambiarFotoGaleria(
  direccion
) {

  if (
    !fotosGaleriaActual.length
  ) {

    return;

  }


  indiceGaleriaActual =
    (
      indiceGaleriaActual +
      direccion +
      fotosGaleriaActual.length
    ) %
    fotosGaleriaActual.length;


  actualizarVisorFoto();

}


/* =========================================================
   ACTUALIZAR VISOR
   ========================================================= */

function actualizarVisorFoto() {

  const foto =
    fotosGaleriaActual[
      indiceGaleriaActual
    ];


  const imagen =
    document.getElementById(
      "visorImagen"
    );


  const contador =
    document.getElementById(
      "visorContador"
    );


  if (
    !foto ||
    !imagen ||
    !contador
  ) {

    return;

  }


  imagen.src =
    foto.miniatura;


  imagen.alt =
    foto.nombre ||
    "Fotografía del partido";


  contador.textContent =
    (indiceGaleriaActual + 1) +
    " / " +
    fotosGaleriaActual.length;

}


/* =========================================================
   TECLADO DE GALERÍA
   ========================================================= */

function manejarTecladoGaleria(
  evento
) {

  const visor =
    document.getElementById(
      "visorGaleria"
    );


  const modal =
    document.getElementById(
      "modalGaleria"
    );


  const visorActivo =
    visor &&
    visor.classList.contains(
      "galeria-visor-activo"
    );


  const modalActivo =
    modal &&
    modal.classList.contains(
      "galeria-modal-activa"
    );


  if (visorActivo) {

    if (
      evento.key === "Escape"
    ) {

      cerrarVisorFoto();

    }


    if (
      evento.key === "ArrowLeft"
    ) {

      cambiarFotoGaleria(
        -1
      );

    }


    if (
      evento.key === "ArrowRight"
    ) {

      cambiarFotoGaleria(
        1
      );

    }


    return;

  }


  if (
    modalActivo &&
    evento.key === "Escape"
  ) {

    cerrarGaleriaPartido();

  }

}


/* =========================================================
   FORMATEAR FECHA DEL PARTIDO
   ========================================================= */

function formatearFechaPartido(
  fecha
) {

  if (!fecha) {

    return "FECHA POR CONFIRMAR";

  }


  const texto =
    String(fecha)
      .trim();


  const partes =
    texto.split(
      /[\/\-]/
    );


  if (
    partes.length !== 3
  ) {

    return texto.toUpperCase();

  }


  const dia =
    Number(
      partes[0]
    );


  const mes =
    Number(
      partes[1]
    );


  const anio =
    Number(
      partes[2]
    );


  if (
    !dia ||
    !mes ||
    !anio ||
    mes < 1 ||
    mes > 12
  ) {

    return texto.toUpperCase();

  }


  const meses = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE"
  ];


  return (
    String(dia).padStart(
      2,
      "0"
    ) +
    " " +
    meses[
      mes - 1
    ] +
    " " +
    anio
  );

}


/* =========================================================
   ESTADO DE LA PÁGINA FOTOS
   ========================================================= */

function mostrarEstadoFotos(
  titulo,
  mensaje
) {

  const listaPartidos =
    document.getElementById(
      "listaPartidos"
    );


  if (!listaPartidos) {
    return;
  }


  listaPartidos.innerHTML = "";


  const contenedor =
    document.createElement(
      "div"
    );

  contenedor.className =
    "partidos-vacio";


  const escudo =
    document.createElement(
      "div"
    );

  escudo.className =
    "partidos-vacio-escudo";


  const imagen =
    document.createElement(
      "img"
    );

  imagen.src =
    "imagenes/Portada.png";

  imagen.alt =
    "Escudo UDA";


  escudo.appendChild(
    imagen
  );


  const encabezado =
    document.createElement(
      "h3"
    );

  encabezado.textContent =
    titulo;


  const texto =
    document.createElement(
      "p"
    );

  texto.textContent =
    mensaje;


  contenedor.appendChild(
    escudo
  );

  contenedor.appendChild(
    encabezado
  );

  contenedor.appendChild(
    texto
  );


  listaPartidos.appendChild(
    contenedor
  );

}


/* =========================================
   AL CARGAR LA PÁGINA
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    cargarPlantilla();

    cargarFotos();


    document.addEventListener(
      "keydown",
      manejarTecladoGaleria
    );

  }
);