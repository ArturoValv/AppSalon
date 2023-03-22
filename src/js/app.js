let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
  nombre: "",
  fecha: "",
  hora: "",
  servicios: [],
};

document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});

function iniciarApp() {
  mostrarSeccion(); //Muestra y oculta las secciones
  tabs(); //Cambia la seccion cuando se presionen los tabs
  botonesPaginador(); //Agrega o quita los botones del paginador
  paginaSiguiente();
  paginaAnterior();

  consultarAPI(); //Consulta la API en el backend de PHP

  nombreCliente(); //Añade el nombre del cliente al objeto de cita
  seleccionarFecha(); //Añade fecha al objeto de cita
  seleccionarHora(); //Añade la fecha de la cita en el objeto

  mostrarResumen(); //Muestra el resumen de la cita
}

function mostrarSeccion() {
  //Ocultar la seccion que tenga la clase de mostrar
  const seccionAnterior = document.querySelector(".mostrar");
  seccionAnterior && seccionAnterior.classList.remove("mostrar");

  //Selecciona seccion con el paso
  const pasoSelector = `#paso-${paso}`;
  const seccion = document.querySelector(pasoSelector);
  seccion.classList.add("mostrar");

  //Quita la clase de actual al tab anterior
  const tabAnterior = document.querySelector(".actual");
  tabAnterior && tabAnterior.classList.remove("actual");

  //Resalta el tab actual
  const tab = document.querySelector(`[data-paso="${paso}"]`);
  tab.classList.add("actual");
}

function tabs() {
  const botones = document.querySelectorAll(".tabs button");

  botones.forEach((boton) => {
    boton.addEventListener("click", function (e) {
      paso = parseInt(e.target.dataset.paso);

      mostrarSeccion();

      botonesPaginador();
    });
  });
}

function botonesPaginador() {
  const paginaAnterior = document.querySelector("#anterior");
  const paginaSiguiente = document.querySelector("#siguiente");

  if (paso === 1) {
    paginaAnterior.classList.add("ocultar");
    paginaSiguiente.classList.remove("ocultar");
  } else if (paso === 3) {
    paginaAnterior.classList.remove("ocultar");
    paginaSiguiente.classList.add("ocultar");
    mostrarResumen();
  } else {
    paginaSiguiente.classList.remove("ocultar");
    paginaAnterior.classList.remove("ocultar");
  }

  mostrarSeccion();
}

function paginaAnterior() {
  const paginaAnterior = document.querySelector("#anterior");
  paginaAnterior.addEventListener("click", function () {
    if (paso <= pasoInicial) return;
    paso--;
    botonesPaginador();
  });
}

function paginaSiguiente() {
  const paginaSiguiente = document.querySelector("#siguiente");
  paginaSiguiente.addEventListener("click", function () {
    if (paso >= pasoFinal) return;
    paso++;
    botonesPaginador();
  });
}

async function consultarAPI() {
  try {
    const url = "http://localhost:3000/api/servicios";
    const resultado = await fetch(url);
    const servicios = await resultado.json();

    mostrarServicios(servicios);
  } catch (error) {
    console.log(error);
  }
}

function mostrarServicios(servicios) {
  servicios.forEach((servicio) => {
    const { id, nombre, precio } = servicio;

    const nombreServicio = document.createElement("P");
    nombreServicio.classList.add("nombre-servicio");
    nombreServicio.textContent = nombre;

    const precioServicio = document.createElement("P");
    precioServicio.classList.add("precio-servicio");
    precioServicio.textContent = `$${precio}`;

    const servicioDiv = document.createElement("DIV");
    servicioDiv.classList.add("servicio");
    servicioDiv.dataset.idServicio = id;
    servicioDiv.onclick = function () {
      seleccionarServicio(servicio);
    };

    servicioDiv.appendChild(nombreServicio);
    servicioDiv.appendChild(precioServicio);

    document.querySelector("#servicios").appendChild(servicioDiv);
  });
}

function seleccionarServicio(servicio) {
  const { id } = servicio;
  const { servicios } = cita;

  //Identificar el elemento al que se le da click
  const divServicio = document.querySelector(`[data-id-servicio = "${id}"]`);

  //Comprobar si un servicio ya fue agregado
  if (servicios.some((agregado) => agregado.id === id)) {
    //Eliminar servicio
    cita.servicios = servicios.filter((agregado) => agregado.id !== id);
    divServicio.classList.remove("seleccionado");
  } else {
    //Agregar servicio
    cita.servicios = [...servicios, servicio];
    divServicio.classList.add("seleccionado");
  }
}

function nombreCliente() {
  cita.nombre = document.querySelector("#nombre").value;
}

function seleccionarFecha() {
  const inputFecha = document.querySelector("#fecha");
  inputFecha.addEventListener("input", function (e) {
    const dia = new Date(e.target.value).getUTCDay();

    if ([6, 0].includes(dia)) {
      e.target.value = "";
      mostrarAlerta("Fines de semana no permitidos", "error", ".formulario");
    } else {
      cita.fecha = e.target.value;
    }
  });
}

function seleccionarHora() {
  const inputHora = document.querySelector("#hora");
  inputHora.addEventListener("input", (e) => {
    const horaCita = e.target.value;
    const hora = horaCita.split(":")[0];
    if (hora < 10 || hora > 18) {
      mostrarAlerta("La hora no es válida", "error", ".formulario");
    } else {
      cita.hora = e.target.value;
    }
  });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
  //Previene que se genere más de 1 alerta
  const alertaPrevia = document.querySelector(".alerta");
  if (alertaPrevia) {
    alertaPrevia.remove();
  }

  //Scripting para crear alerta
  const alerta = document.createElement("DIV");
  alerta.textContent = mensaje;
  alerta.classList.add("alerta");
  alerta.classList.add(tipo);

  const referencia = document.querySelector(elemento);
  referencia.appendChild(alerta);

  if (desaparece) {
    //Eliminar Alerta
    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

function mostrarResumen() {
  const resumen = document.querySelector(".contenido-resumen");

  //Limpiar el contenido de resumen
  while (resumen.firstChild) {
    resumen.removeChild(resumen.firstChild);
  }

  if (Object.values(cita).includes("") || cita.servicios.length === 0) {
    mostrarAlerta(
      "Faltan datos de servicios, fecha u hora",
      "error",
      ".contenido-resumen",
      false
    );

    return;
  }

  //Formatear el div de resumen
  const { nombre, fecha, hora, servicios } = cita;

  //Heading para servicios en resumen
  const headingServicios = document.createElement("H3");
  headingServicios.textContent = "Resumen de Servicios";
  resumen.appendChild(headingServicios);

  //Iterando y mostrando servicios
  servicios.forEach((servicio) => {
    const { id, precio, nombre } = servicio;
    const contenedorServicio = document.createElement("DIV");
    contenedorServicio.classList.add("contenedor-servicio");

    const textoServicio = document.createElement("P");
    textoServicio.textContent = nombre;

    const precioServicio = document.createElement("P");
    precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

    contenedorServicio.appendChild(textoServicio);
    contenedorServicio.appendChild(precioServicio);

    resumen.appendChild(contenedorServicio);

    console.log(resumen);
  });

  //Heading para cita en resumen
  const headingCita = document.createElement("H3");
  headingCita.textContent = "Resumen de Cita";
  resumen.appendChild(headingCita);

  const nombreCliente = document.createElement("P");
  nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

  //Formatear la fecha en español
  const fechaObj = new Date(fecha);
  const mes = fechaObj.getMonth();
  const dia = fechaObj.getDate() + 2;
  const year = fechaObj.getFullYear();

  const fechaUTC = new Date(Date.UTC(year, mes, dia));

  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const fechaFormateada = fechaUTC.toLocaleDateString("es-MX", opciones);

  const fechaCita = document.createElement("P");
  fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

  const horaCita = document.createElement("P");
  horaCita.innerHTML = `<span>Hora:</span> ${hora} horas`;

  //Boton para crear una cita
  const botonReservar = document.createElement("BUTTON");
  botonReservar.classList.add("boton");
  botonReservar.textContent = "Reservar Cita";
  botonReservar.onclick = reservarCita;

  resumen.appendChild(nombreCliente);
  resumen.appendChild(fechaCita);
  resumen.appendChild(horaCita);

  resumen.appendChild(botonReservar);
}

function reservarCita() {
  const datos = new FormData();

  datos.append("nombre", "Arturo");

  //console.log([...datos]);
}
