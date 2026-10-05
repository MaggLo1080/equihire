/**
 * EquiHire · Motor de análisis de ofertas laborales.
 * HU-01 · Detecta frases o requisitos con posible sesgo de género, explica cada hallazgo
 * y propone una alternativa inclusiva.
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
          sugerencia: regla.sugerencia
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

  return { analizarOferta: analizarOferta };
});
