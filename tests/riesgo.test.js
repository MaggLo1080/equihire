/**
 * Pruebas de HU-02 · Consultar el índice de riesgo de equidad y el resumen de hallazgos.
 */
const { analizarOferta } = require('../src/analizador.js');
const { calcularIndiceRiesgo, generarReporte } = require('../src/riesgo.js');

describe('HU-02 · Índice de riesgo de equidad y reporte', () => {
  test('Criterio 1: la disponibilidad irrestricta produce un índice de riesgo medio y detalla el hallazgo', () => {
    const hallazgos = analizarOferta('Se requiere disponibilidad irrestricta de horario.');
    const reporte = generarReporte(hallazgos);

    expect(reporte.nivel).toBe('Medio');
    expect(reporte.totalHallazgos).toBe(1);
    expect(reporte.porCategoria).toEqual({ 'Condición laboral': 1 });
    expect(reporte.resumen).toContain('riesgo de equidad es medio');
  });

  test('Criterio 2: sin hallazgos, el índice es bajo y el resumen lo indica explícitamente', () => {
    const reporte = generarReporte(analizarOferta('Buscamos persona con experiencia en contabilidad.'));

    expect(reporte.puntaje).toBe(0);
    expect(reporte.nivel).toBe('Bajo');
    expect(reporte.resumen).toContain('No se encontraron');
  });

  test('un requisito explícito de género produce riesgo alto', () => {
    const reporte = generarReporte(analizarOferta('Se busca señorita para atención al cliente.'));
    expect(reporte.nivel).toBe('Alto');
  });

  test('un hallazgo sutil produce riesgo bajo', () => {
    expect(calcularIndiceRiesgo([{ severidad: 1 }])).toEqual({ puntaje: 10, nivel: 'Bajo' });
  });

  test('el puntaje nunca supera 100', () => {
    const hallazgos = [{ severidad: 3 }, { severidad: 3 }, { severidad: 3 }];
    expect(calcularIndiceRiesgo(hallazgos).puntaje).toBe(100);
  });

  test('el resumen agrupa los hallazgos por categoría', () => {
    const reporte = generarReporte(
      analizarOferta('Requisitos: soltera, buena presencia y disponibilidad total.')
    );
    expect(reporte.porCategoria).toEqual({
      'Requisito discriminatorio': 1,
      'Criterio subjetivo': 1,
      'Condición laboral': 1
    });
    expect(reporte.resumen).toContain('Se encontraron 3 hallazgos');
  });
});
