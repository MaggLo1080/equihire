/**
 * EquiHire · Motor de análisis de ofertas laborales.
 * HU-01 · Detecta frases o requisitos con posible sesgo de género, explica cada hallazgo
 * y propone una alternativa inclusiva.
 * FR-01 · Valida que el texto no esté vacío ni supere LONGITUD_MAXIMA caracteres.
 */
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) {
    module.exports = fabrica(require('./catalogo.js'));
  } else {
    raiz.EquiHireAnalizador = fabrica(raiz.EquiHireCatalogo);
  }
})(typeof self !== 'undefined' ? self : this, function (catalogoBase) {
  'use strict';

  // Límites de palabra compatibles con tildes y ñ (\b no reconoce letras acentuadas).
  var INICIO = '(?<![\\p{L}\\p{N}])';
  var FIN = '(?![\\p{L}\\p{N}])';

  // FR-01 · Límite de longitud: cubre una vacante completa y acota el tiempo de análisis (NFR-01, SC-03).
  var LONGITUD_MAXIMA = 10000;

  /**
   * Valida el texto antes de analizarlo.
   * @param {string} texto Texto ingresado por la persona usuaria.
   * @returns {{valido: boolean, motivo: (string|null), texto: string}}
   *   motivo: 'vacio' si no hay contenido, 'excede' si supera LONGITUD_MAXIMA.
   */
  function validarTexto(texto) {
    var limpio = typeof texto === 'string' ? texto.trim() : '';
    if (limpio.length === 0) {
      return { valido: false, motivo: 'vacio', texto: limpio };
    }
    if (limpio.length > LONGITUD_MAXIMA) {
      return { valido: false, motivo: 'excede', texto: limpio };
    }
    return { valido: true, motivo: null, texto: limpio };
  }

  function construirExpresion(patron) {
    return new RegExp(INICIO + '(?:' + patron + ')' + FIN, 'giu');
  }

  /**
   * Analiza el texto de una oferta laboral.
   * @param {string} texto Texto completo de la vacante.
   * @param {Array} [catalogo] Reglas a aplicar; por defecto, el catálogo inicial.
   * @returns {Array} Hallazgos ordenados por posición, sin solapamientos.
   */
  function analizarOferta(texto, catalogo) {
    if (typeof texto !== 'string') {
      throw new TypeError('El texto de la oferta debe ser una cadena de caracteres.');
    }
    var reglas = catalogo || catalogoBase;
    var encontrados = [];

    reglas.forEach(function (regla) {
      var expresion = construirExpresion(regla.patron);
      var coincidencia;
      while ((coincidencia = expresion.exec(texto)) !== null) {
        if (coincidencia[0].length === 0) {
          expresion.lastIndex += 1;
          continue;
        }
        encontrados.push({
          id: regla.id,
          frase: coincidencia[0],
          inicio: coincidencia.index,
          fin: coincidencia.index + coincidencia[0].length,
          categoria: regla.categoria,
          severidad: regla.severidad,
          explicacion: regla.explicacion,
          sugerencia: regla.sugerencia,
          reemplazo: typeof regla.reemplazo === 'string' ? regla.reemplazo : ''
        });
      }
    });

    // Orden por posición; ante el mismo inicio, primero la coincidencia más larga.
    encontrados.sort(function (a, b) {
      return a.inicio - b.inicio || b.fin - a.fin;
    });

    // Elimina coincidencias superpuestas para no marcar dos veces la misma frase.
    var hallazgos = [];
    var finAnterior = -1;
    encontrados.forEach(function (h) {
      if (h.inicio >= finAnterior) {
        hallazgos.push(h);
        finAnterior = h.fin;
      }
    });
    return hallazgos;
  }

  return { analizarOferta: analizarOferta, validarTexto: validarTexto, LONGITUD_MAXIMA: LONGITUD_MAXIMA };
});
