/**
 * EquiHire · Interfaz de usuario.
 * HU-01 · Ingreso del texto, resaltado de frases, explicación y alternativa inclusiva.
 * HU-02 · Índice de riesgo de equidad y resumen de hallazgos.
 * HU-04 · Aplicar o editar una sugerencia conservando la versión original.
 * HU-16 · Exportar el reporte a PDF desde el navegador (el texto no sale del equipo).
 */
(function () {
  'use strict';

  var Analizador = window.EquiHireAnalizador;
  var generarReporte = window.EquiHireRiesgo.generarReporte;
  var Versiones = window.EquiHireVersiones;
  var escapar = window.EquiHireUtilidades.escaparHtml;

  var EJEMPLOS = {
    sesgo:
      'Importante empresa del sector comercial busca señorita para atención al cliente en su sede principal.\n\n' +
      'Requisitos: bachillerato completo, buena presencia, soltera y sin hijos, con disponibilidad total de horario.\n\n' +
      'Buscamos un perfil agresivo en ventas que disfrute de un ambiente altamente competitivo.',
    neutro:
      'Empresa del sector comercial busca persona para atención al cliente en su sede principal.\n\n' +
      'Funciones: orientar a los clientes, registrar solicitudes y hacer seguimiento a cada caso.\n\n' +
      'Requisitos: bachillerato completo, un año de experiencia en servicio al cliente y manejo básico de herramientas ofimáticas. ' +
      'Horario de lunes a viernes de 8:00 a. m. a 5:00 p. m.'
  };

  var NIVEL_SEVERIDAD = { 1: 'Sutil', 2: 'Moderado', 3: 'Explícito' };
  var formatoMiles = new Intl.NumberFormat('es-CO');

  var $texto = document.getElementById('texto');
  var $vista = document.getElementById('vista-marcada');
  var $analizar = document.getElementById('analizar');
  var $editar = document.getElementById('editar');
  var $restaurar = document.getElementById('restaurar');
  var $exportar = document.getElementById('exportar');
  var $version = document.getElementById('version');
  var $mensaje = document.getElementById('mensaje');
  var $vacio = document.getElementById('estado-vacio');
  var $lista = document.getElementById('hallazgos');
  var $dialogo = document.getElementById('dialogo-sugerencia');
  var $dlgFrase = document.getElementById('dlg-frase');
  var $dlgExplicacion = document.getElementById('dlg-explicacion');
  var $dlgSugerencia = document.getElementById('dlg-sugerencia');
  var $dlgReemplazo = document.getElementById('dlg-reemplazo');
  var $dlgTitulo = document.getElementById('dlg-titulo');

  document.getElementById('limite').textContent = formatoMiles.format(Analizador.LONGITUD_MAXIMA);

  // Estado de la sesión de trabajo (solo en memoria: no se guarda ni se envía).
  var historial = null;
  var hallazgosActuales = [];
  var hallazgoEnEdicion = null;

  function marcarTexto(texto, hallazgos) {
    var html = '';
    var posicion = 0;
    hallazgos.forEach(function (h, i) {
      html += escapar(texto.slice(posicion, h.inicio));
      html +=
        '<mark class="severidad-' + h.severidad + '" id="marca-' + (i + 1) + '">' +
        escapar(h.frase) + '<sup>' + (i + 1) + '</sup></mark>';
      posicion = h.fin;
    });
    return html + escapar(texto.slice(posicion));
  }

  function mostrarHallazgos(hallazgos) {
    if (hallazgos.length === 0) {
      $lista.innerHTML =
        '<li class="sin-hallazgos">No se encontraron frases ni requisitos con sesgo de género en esta oferta.</li>';
      return;
    }
    $lista.innerHTML = hallazgos
      .map(function (h, i) {
        return (
          '<li class="hallazgo severidad-' + h.severidad + '">' +
          '<p class="hallazgo-frase"><span class="numero">' + (i + 1) + '</span>“' + escapar(h.frase) + '”</p>' +
          '<p class="hallazgo-meta">' + escapar(h.categoria) + ', sesgo ' +
          NIVEL_SEVERIDAD[h.severidad].toLowerCase() + '</p>' +
          '<p class="hallazgo-explicacion">' + escapar(h.explicacion) + '</p>' +
          '<p class="hallazgo-sugerencia"><strong>Alternativa:</strong> ' + escapar(h.sugerencia) + '</p>' +
          '<p class="hallazgo-acciones no-imprimir"><button type="button" class="secundario pequeno" data-aplicar="' + i + '" ' +
          'aria-label="Aplicar sugerencia al hallazgo ' + (i + 1) + '">Aplicar sugerencia</button></p>' +
          '</li>'
        );
      })
      .join('');
  }

  function mostrarIndice(hallazgos) {
    var reporte = generarReporte(hallazgos);
    var $indice = document.getElementById('indice');
    var $nivel = document.getElementById('nivel');
    document.getElementById('puntaje').textContent = reporte.puntaje;
    $nivel.textContent = 'Riesgo ' + reporte.nivel.toLowerCase();
    $indice.dataset.nivel = reporte.nivel.toLowerCase();
    document.getElementById('medidor-relleno').style.width = reporte.puntaje + '%';
    document.getElementById('resumen').textContent = reporte.resumen;
    $indice.hidden = false;
  }

  function mostrarVersion() {
    var actual = Versiones.versionActual(historial);
    $version.textContent =
      actual.numero === 1
        ? 'Versión 1: texto original.'
        : 'Versión ' + actual.numero + ' (' + actual.descripcion.toLowerCase() + '). La versión original se conserva.';
    $version.hidden = false;
    $restaurar.hidden = actual.numero === 1;
  }

  /** Analiza el texto y actualiza toda la vista. Devuelve la duración en milisegundos. */
  function renderizar(texto) {
    var inicio = performance.now();
    hallazgosActuales = Analizador.analizarOferta(texto);
    var duracion = Math.max(1, Math.round(performance.now() - inicio));

    $vista.innerHTML = marcarTexto(texto, hallazgosActuales);
    $vista.hidden = false;
    $texto.hidden = true;
    $editar.hidden = false;
    $exportar.disabled = false;
    $vacio.hidden = true;
    mostrarHallazgos(hallazgosActuales);
    mostrarIndice(hallazgosActuales);
    mostrarVersion();
    document.getElementById('fecha-reporte').textContent = new Date().toLocaleString('es-CO');
    return duracion;
  }

  function analizar() {
    var validacion = Analizador.validarTexto($texto.value);
    if (!validacion.valido) {
      $mensaje.textContent =
        validacion.motivo === 'vacio'
          ? 'Pega el texto de la oferta para poder analizarla.'
          : 'La oferta tiene ' + formatoMiles.format(validacion.texto.length) + ' caracteres. El máximo es ' +
            formatoMiles.format(Analizador.LONGITUD_MAXIMA) + '; recorta el texto para analizarla.';
      $texto.focus();
      return;
    }
    // Un análisis iniciado desde el campo de texto abre un historial nuevo (versión 1 = este texto).
    var actual = historial && Versiones.versionActual(historial);
    if (!actual || actual.texto !== validacion.texto) {
      historial = Versiones.crearHistorial(validacion.texto);
    }
    var duracion = renderizar(validacion.texto);
    $mensaje.textContent = 'Análisis completado en ' + duracion + ' ms.';
  }

  function editar() {
    $vista.hidden = true;
    $texto.hidden = false;
    $editar.hidden = true;
    $mensaje.textContent = '';
    $texto.focus();
  }

  function abrirDialogo(indice) {
    hallazgoEnEdicion = hallazgosActuales[indice];
    if (!hallazgoEnEdicion) return;
    $dlgTitulo.textContent = 'Aplicar sugerencia al hallazgo ' + (indice + 1);
    $dlgFrase.textContent = '“' + hallazgoEnEdicion.frase + '”';
    $dlgExplicacion.textContent = hallazgoEnEdicion.explicacion;
    $dlgSugerencia.textContent = hallazgoEnEdicion.sugerencia;
    $dlgReemplazo.value = hallazgoEnEdicion.reemplazo;
    $dialogo.showModal();
    $dlgReemplazo.focus();
  }

  function aceptarSugerencia(evento) {
    evento.preventDefault();
    var actual = Versiones.versionActual(historial);
    try {
      var nuevoTexto = Versiones.aplicarSugerencia(actual.texto, hallazgoEnEdicion, $dlgReemplazo.value);
      historial = Versiones.agregarVersion(historial, nuevoTexto, 'Sugerencia aplicada a «' + hallazgoEnEdicion.frase + '»');
      $texto.value = nuevoTexto;
      $dialogo.close();
      renderizar(nuevoTexto);
      $mensaje.textContent = 'Se aplicó la sugerencia y se volvió a analizar la oferta.';
    } catch (e) {
      $dialogo.close();
      $mensaje.textContent = e.message;
    }
    hallazgoEnEdicion = null;
  }

  function restaurar() {
    historial = Versiones.restaurarOriginal(historial);
    var texto = Versiones.versionActual(historial).texto;
    $texto.value = texto;
    renderizar(texto);
    $mensaje.textContent = 'Se restauró el texto original.';
  }

  function exportar() {
    if ($exportar.disabled) return;
    // El navegador genera el PDF localmente («Guardar como PDF»): la oferta no se envía a ningún servidor.
    window.print();
  }

  $analizar.addEventListener('click', analizar);
  $editar.addEventListener('click', editar);
  $restaurar.addEventListener('click', restaurar);
  $exportar.addEventListener('click', exportar);
  $lista.addEventListener('click', function (e) {
    var boton = e.target.closest('[data-aplicar]');
    if (boton) abrirDialogo(Number(boton.dataset.aplicar));
  });
  document.getElementById('dlg-formulario').addEventListener('submit', aceptarSugerencia);
  document.getElementById('dlg-cancelar').addEventListener('click', function () {
    hallazgoEnEdicion = null;
    $dialogo.close();
  });
  document.querySelectorAll('[data-ejemplo]').forEach(function (boton) {
    boton.addEventListener('click', function () {
      $texto.value = EJEMPLOS[boton.dataset.ejemplo];
      editar();
    });
  });
})();
