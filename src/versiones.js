/**
 * EquiHire · Versiones de la oferta.
 * HU-04 · Aplicar o editar una sugerencia conservando el texto original (FR-06).
 *
 * El historial es inmutable: cada operación devuelve un historial nuevo.
 * La versión 1 es siempre el texto original analizado y nunca se modifica.
 */
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) {
    module.exports = fabrica();
  } else {
    raiz.EquiHireVersiones = fabrica();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Crea el historial a partir del texto original.
   * @param {string} textoOriginal
   * @returns {{versiones: Array<{numero: number, texto: string, descripcion: string}>}}
   */
  function crearHistorial(textoOriginal) {
    if (typeof textoOriginal !== 'string' || textoOriginal.trim() === '') {
      throw new TypeError('El historial necesita el texto original de la oferta.');
    }
    return { versiones: [{ numero: 1, texto: textoOriginal, descripcion: 'Texto original' }] };
  }

  function versionActual(historial) {
    return historial.versiones[historial.versiones.length - 1];
  }

  function original(historial) {
    return historial.versiones[0];
  }

  /**
   * Agrega una versión nueva sin alterar las anteriores.
   */
  function agregarVersion(historial, texto, descripcion) {
    var nueva = { numero: historial.versiones.length + 1, texto: texto, descripcion: descripcion };
    return { versiones: historial.versiones.concat([nueva]) };
  }

  /**
   * Reemplaza solo el fragmento señalado por el hallazgo.
   * Si el reemplazo es vacío, elimina el fragmento y los espacios o comas que queden duplicados.
   * @throws {Error} si el hallazgo no corresponde al texto (posiciones desactualizadas).
   */
  function aplicarSugerencia(texto, hallazgo, reemplazo) {
    if (texto.slice(hallazgo.inicio, hallazgo.fin) !== hallazgo.frase) {
      throw new Error('El hallazgo no corresponde al texto actual; vuelve a analizar la oferta.');
    }
    var nuevo = typeof reemplazo === 'string' ? reemplazo.trim() : '';
    var antes = texto.slice(0, hallazgo.inicio);
    var despues = texto.slice(hallazgo.fin);
    if (nuevo === '') {
      antes = antes.replace(/[ \t]+$/, '');
      despues = despues.replace(/^[ \t]*,?/, '');
      if (/,$/.test(antes) && /^[ \t]*(?:y|e|o|u)\b/.test(despues)) {
        antes = antes.replace(/,$/, '');
      }
      // Si el fragmento cerraba una enumeración («… y sin hijos.»), se quita el conector que queda suelto.
      if (/^[ \t]*[.;:]/.test(despues) || despues.trim() === '') {
        antes = antes.replace(/(?:,|[ \t]+(?:y|e|o|u))$/, '');
        despues = despues.replace(/^[ \t]+/, '');
      }
      var union = antes && despues && !/^[\s.,;:)]/.test(despues) && !/[\s(]$/.test(antes) ? ' ' : '';
      return antes + union + despues;
    }
    return antes + nuevo + despues;
  }

  /**
   * Vuelve al texto original registrándolo como una versión más (trazabilidad).
   */
  function restaurarOriginal(historial) {
    return agregarVersion(historial, original(historial).texto, 'Restauración del texto original');
  }

  return {
    crearHistorial: crearHistorial,
    versionActual: versionActual,
    original: original,
    agregarVersion: agregarVersion,
    aplicarSugerencia: aplicarSugerencia,
    restaurarOriginal: restaurarOriginal
  };
});
