/**
 * EquiHire · Utilidades de presentación.
 * SC-01 · Todo texto ingresado por la persona usuaria se escapa antes de insertarse en el HTML,
 * para que una oferta con etiquetas o scripts se muestre como texto y nunca se ejecute (XSS).
 */
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) {
    module.exports = fabrica();
  } else {
    raiz.EquiHireUtilidades = fabrica();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var ENTIDADES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  function escaparHtml(texto) {
    return String(texto).replace(/[&<>"']/g, function (c) {
      return ENTIDADES[c];
    });
  }

  return { escaparHtml: escaparHtml };
});
