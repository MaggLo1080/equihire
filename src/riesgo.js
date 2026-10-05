/**
 * EquiHire · Índice de riesgo de equidad y resumen de hallazgos.
 * HU-02 · Consultar el índice de riesgo de equidad y el resumen de hallazgos.
 *
 * Cada hallazgo suma puntos según su severidad (sutil 10, moderado 30, explícito 60),
 * con un máximo de 100. Niveles: Bajo (0-24), Medio (25-59), Alto (60-100).
 */
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) {
    module.exports = fabrica();
  } else {
    raiz.EquiHireRiesgo = fabrica();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var PESOS = { 1: 10, 2: 30, 3: 60 };
  var UMBRAL_MEDIO = 25;
  var UMBRAL_ALTO = 60;

  function calcularIndiceRiesgo(hallazgos) {
    var suma = hallazgos.reduce(function (total, h) {
      return total + (PESOS[h.severidad] || 0);
    }, 0);
    var puntaje = Math.min(100, suma);
    var nivel = puntaje >= UMBRAL_ALTO ? 'Alto' : puntaje >= UMBRAL_MEDIO ? 'Medio' : 'Bajo';
    return { puntaje: puntaje, nivel: nivel };
  }

  function generarReporte(hallazgos) {
    var indice = calcularIndiceRiesgo(hallazgos);
    var porCategoria = {};
    hallazgos.forEach(function (h) {
      porCategoria[h.categoria] = (porCategoria[h.categoria] || 0) + 1;
    });

    var resumen;
    if (hallazgos.length === 0) {
      resumen = 'No se encontraron frases ni requisitos con sesgo de género. El riesgo de equidad es bajo.';
    } else {
      var detalle = Object.keys(porCategoria)
        .map(function (c) {
          return porCategoria[c] + ' de ' + c.toLowerCase();
        })
        .join(', ');
      var sustantivo = hallazgos.length === 1 ? 'hallazgo' : 'hallazgos';
      resumen =
        'Se encontraron ' + hallazgos.length + ' ' + sustantivo + ' (' + detalle + '). ' +
        'El riesgo de equidad es ' + indice.nivel.toLowerCase() + '.';
    }

    return {
      puntaje: indice.puntaje,
      nivel: indice.nivel,
      totalHallazgos: hallazgos.length,
      porCategoria: porCategoria,
      resumen: resumen
    };
  }

  return { calcularIndiceRiesgo: calcularIndiceRiesgo, generarReporte: generarReporte };
});
