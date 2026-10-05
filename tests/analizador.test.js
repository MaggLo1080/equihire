/**
 * Pruebas de HU-01 · Analizar una oferta laboral para detectar sesgo de género.
 */
const { analizarOferta } = require('../src/analizador.js');

describe('HU-01 · Análisis de ofertas laborales', () => {
  test('Criterio 1: resalta "señorita para atención", explica el sesgo y propone una alternativa', () => {
    const texto = 'Se busca señorita para atención al cliente en la sede principal.';
    const hallazgos = analizarOferta(texto);

    expect(hallazgos).toHaveLength(1);
    const [h] = hallazgos;
    expect(h.frase).toBe('señorita');
    expect(texto.slice(h.inicio, h.fin)).toBe('señorita');
    expect(h.explicacion.length).toBeGreaterThan(0);
    expect(h.sugerencia).toContain('persona');
  });

  test('Criterio 2: un texto sin términos sesgados no produce hallazgos', () => {
    const texto =
      'Empresa del sector comercial busca persona para atención al cliente. ' +
      'Requisitos: un año de experiencia en servicio al cliente y manejo de herramientas ofimáticas. ' +
      'Horario de lunes a viernes de 8:00 a. m. a 5:00 p. m.';
    expect(analizarOferta(texto)).toEqual([]);
  });

  test('detecta términos sin importar mayúsculas ni tildes', () => {
    const hallazgos = analizarOferta('SEÑORITA con BUENA PRESENCIA. Senorita bilingüe.');
    expect(hallazgos.map((h) => h.id)).toEqual(['mujer-joven', 'buena-presencia', 'mujer-joven']);
  });

  test('devuelve los hallazgos en el orden en que aparecen en el texto', () => {
    const texto = 'Requisitos: soltera, sin hijos y disponibilidad total de horario.';
    const hallazgos = analizarOferta(texto);
    const posiciones = hallazgos.map((h) => h.inicio);
    expect(posiciones).toEqual([...posiciones].sort((a, b) => a - b));
    expect(hallazgos.map((h) => h.id)).toEqual(['estado-civil', 'sin-hijos', 'disponibilidad-irrestricta']);
  });

  test('no marca palabras que solo contienen el término dentro de otra palabra', () => {
    expect(analizarOferta('Se valorará experiencia en el área de casos especiales.')).toEqual([]);
  });

  test('no marca expresiones inclusivas como "hombres y mujeres"', () => {
    expect(analizarOferta('Invitamos a postularse a hombres y mujeres con experiencia.')).toEqual([]);
  });

  test('no confunde "disponibilidad inmediata" con disponibilidad irrestricta', () => {
    expect(analizarOferta('Se requiere disponibilidad inmediata para iniciar.')).toEqual([]);
  });

  test('cada hallazgo incluye categoría, severidad, explicación y sugerencia', () => {
    const [h] = analizarOferta('Buscamos un perfil agresivo en ventas.');
    expect(h).toMatchObject({
      id: 'rasgos-agresivos',
      categoria: expect.any(String),
      severidad: 1,
      explicacion: expect.any(String),
      sugerencia: expect.any(String)
    });
  });

  test('rechaza entradas que no son texto', () => {
    expect(() => analizarOferta(null)).toThrow(TypeError);
  });
});
