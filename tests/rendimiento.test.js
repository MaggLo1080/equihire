/**
 * Prueba de NFR-01 y SC-03 · El análisis de una oferta de longitud máxima termina rápido
 * (protege contra expresiones regulares con retroceso excesivo, ReDoS).
 */
const { analizarOferta, LONGITUD_MAXIMA } = require('../src/analizador.js');

test('una oferta de L caracteres con muchos términos se analiza en menos de 1 segundo', () => {
  const bloque = 'Se busca señorita con buena presencia, soltera, agresiva y con disponibilidad total. ';
  const texto = bloque.repeat(Math.ceil(LONGITUD_MAXIMA / bloque.length)).slice(0, LONGITUD_MAXIMA);
  const inicio = Date.now();
  const hallazgos = analizarOferta(texto);
  expect(Date.now() - inicio).toBeLessThan(1000);
  expect(hallazgos.length).toBeGreaterThan(100);
});
