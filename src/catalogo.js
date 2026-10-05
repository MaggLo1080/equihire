/**
 * EquiHire · Catálogo inicial de expresiones con posible sesgo de género.
 * Cada regla define un patrón (expresión regular sin delimitadores), su categoría,
 * su severidad (1 = sutil, 2 = moderado, 3 = explícito), una explicación y una alternativa.
 * HU-01 · Analizar una oferta laboral para detectar sesgo de género.
 */
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) {
    module.exports = fabrica();
  } else {
    raiz.EquiHireCatalogo = fabrica();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return [
    {
      id: 'mujer-joven',
      patron: 'se(?:ñ|n)oritas?|chicas?|muchachas?',
      categoria: 'Lenguaje excluyente',
      severidad: 3,
      explicacion:
        'Dirige la vacante a mujeres jóvenes y deja por fuera a otras personas igualmente calificadas para el cargo.',
      sugerencia: 'Usa un término neutro como “persona”, por ejemplo: “persona para atención al cliente”.'
    },
    {
      id: 'sexo-requerido',
      patron: '(?:sexo|g[eé]nero)\\s*:?\\s*(?:masculino|femenino)',
      categoria: 'Requisito discriminatorio',
      severidad: 3,
      explicacion: 'El sexo o el género no es un requisito para desempeñar el cargo.',
      sugerencia: 'Elimina el requisito y describe las competencias que el cargo realmente necesita.'
    },
    {
      id: 'solo-un-genero',
      patron:
        '(?:s[oó]lo|solamente|[uú]nicamente|exclusivamente)\\s+(?:para\\s+)?(?:hombres|mujeres|varones|damas|caballeros)',
      categoria: 'Requisito discriminatorio',
      severidad: 3,
      explicacion: 'Restringe la convocatoria a un solo género sin una razón relacionada con el cargo.',
      sugerencia: 'Abre la convocatoria a todas las personas que cumplan el perfil.'
    },
    {
      id: 'se-busca-genero',
      patron:
        'se\\s+(?:requieren?|necesitan?|buscan?)\\s+(?:un\\s+|una\\s+)?(?:hombres?|mujer(?:es)?|var[oó]n(?:es)?|damas?|caballeros?)',
      categoria: 'Requisito discriminatorio',
      severidad: 3,
      explicacion: 'Define el género de la persona a contratar, lo que excluye a otros perfiles calificados.',
      sugerencia: 'Escribe “se requiere una persona con experiencia en…” y describe el perfil.'
    },
    {
      id: 'buena-presencia',
      patron: 'buena\\s+presencia|excelente\\s+presentaci[oó]n\\s+personal',
      categoria: 'Criterio subjetivo',
      severidad: 2,
      explicacion:
        'Es un criterio de apariencia física difícil de medir que suele exigirse con más rigor a las mujeres.',
      sugerencia: 'Si el cargo es de atención al público, describe la conducta esperada: “trato cordial y cumplimiento del código de vestimenta”.'
    },
    {
      id: 'apariencia-atractiva',
      patron: '(?:f[ií]sicamente|apariencia|aspecto)\\s+atractiv[oa]|bonita|guapa',
      categoria: 'Criterio subjetivo',
      severidad: 2,
      explicacion: 'La apariencia física no es una competencia laboral y su exigencia suele recaer sobre las mujeres.',
      sugerencia: 'Elimina la referencia a la apariencia y describe las habilidades de servicio que necesitas.'
    },
    {
      id: 'estado-civil',
      patron: 'estado\\s+civil|solter[oa]s?|casad[oa]s?',
      categoria: 'Requisito discriminatorio',
      severidad: 3,
      explicacion: 'La situación familiar no se relaciona con el desempeño y su exigencia penaliza con más frecuencia a las mujeres.',
      sugerencia: 'Elimina este requisito de la oferta.'
    },
    {
      id: 'sin-hijos',
      patron: 'sin\\s+hijos|no\\s+tener\\s+hijos|sin\\s+cargas?\\s+familiar(?:es)?',
      categoria: 'Requisito discriminatorio',
      severidad: 3,
      explicacion: 'Exigir no tener hijos excluye a quienes tienen responsabilidades de cuidado, que recaen en su mayoría sobre las mujeres.',
      sugerencia: 'Elimina este requisito y, si es necesario, especifica el horario real del cargo.'
    },
    {
      id: 'embarazo',
      patron: '(?:prueba|test)\\s+de\\s+embarazo|no\\s+estar\\s+embarazada|embarazadas?',
      categoria: 'Requisito discriminatorio',
      severidad: 3,
      explicacion: 'Condicionar la contratación a un embarazo es una práctica discriminatoria.',
      sugerencia: 'Elimina cualquier mención al embarazo en la oferta y en el proceso de selección.'
    },
    {
      id: 'disponibilidad-irrestricta',
      patron:
        'disponibilidad\\s+(?:de\\s+tiempo\\s+)?(?:total|absoluta|irrestricta|ilimitada|completa)(?:\\s+de\\s+horario)?|disponibilidad\\s+24\\s*/\\s*7',
      categoria: 'Condición laboral',
      severidad: 2,
      explicacion:
        'Pedir disponibilidad sin límites, cuando el cargo no lo exige, desalienta a quienes tienen responsabilidades de cuidado, que en su mayoría son mujeres.',
      sugerencia: 'Especifica el horario real: “de lunes a viernes de 8:00 a. m. a 5:00 p. m., con disponibilidad ocasional para eventos programados”.'
    },
    {
      id: 'rasgos-agresivos',
      patron: 'agresiv[oa]s?|dominantes?',
      categoria: 'Rasgos estereotipados',
      severidad: 1,
      explicacion:
        'Son rasgos asociados culturalmente a lo masculino. Estudios sobre anuncios de empleo muestran que este tipo de lenguaje hace la vacante menos atractiva para mujeres.',
      sugerencia: 'Prefiere expresiones como “con iniciativa” u “orientación a resultados”.'
    },
    {
      id: 'ambiente-competitivo',
      patron: '(?:ambiente|entorno)\\s+(?:altamente\\s+|muy\\s+)?competitivo',
      categoria: 'Rasgos estereotipados',
      severidad: 1,
      explicacion:
        'Destacar la competencia interna como rasgo central del trabajo puede desmotivar la postulación de algunos perfiles.',
      sugerencia: 'Describe el entorno en términos de metas y colaboración: “equipo orientado a metas compartidas”.'
    }
  ];
});
