/**
 * EquiHire · Interfaz de usuario.
 * HU-01 · Ingreso del texto, resaltado de frases, explicación y alternativa inclusiva.
 * HU-02 · Índice de riesgo de equidad y resumen de hallazgos.
 */
(function () {
  'use strict';

  var analizarOferta = window.EquiHireAnalizador.analizarOferta;
  var generarReporte = window.EquiHireRiesgo.generarReporte;

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

  var $texto = document.getElementById('texto');
  var $vista = document.getElementById('vista-marcada');
  var $analizar = document.getElementById('analizar');
  var $editar = document.getElementById('editar');
  var $mensaje = document.getElementById('mensaje');
  var $vacio = document.getElementById('estado-vacio');
  var $lista = document.getElementById('hallazgos');

  function escapar(texto) {
    return texto.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

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

  function analizar() {
    var texto = $texto.value.trim();
    if (!texto) {
      $mensaje.textContent = 'Pega el texto de la oferta para poder analizarla.';
      $texto.focus();
      return;
    }
    var inicio = performance.now();
    var hallazgos = analizarOferta(texto);
    var duracion = Math.max(1, Math.round(performance.now() - inicio));

    $vista.innerHTML = marcarTexto(texto, hallazgos);
    $vista.hidden = false;
    $texto.hidden = true;
    $editar.hidden = false;
    $vacio.hidden = true;
    mostrarHallazgos(hallazgos);
    mostrarIndice(hallazgos);
    $mensaje.textContent = 'Análisis completado en ' + duracion + ' ms.';
  }

  function editar() {
    $vista.hidden = true;
    $texto.hidden = false;
    $editar.hidden = true;
    $mensaje.textContent = '';
    $texto.focus();
  }

  $analizar.addEventListener('click', analizar);
  $editar.addEventListener('click', editar);
  document.querySelectorAll('[data-ejemplo]').forEach(function (boton) {
    boton.addEventListener('click', function () {
      $texto.value = EJEMPLOS[boton.dataset.ejemplo];
      editar();
    });
  });
})();
