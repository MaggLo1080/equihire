/**
 * Pruebas de HU-04 · Aplicar o editar una sugerencia conservando el original (FR-06).
 */
const { analizarOferta } = require('../src/analizador.js');
const V = require('../src/versiones.js');

const OFERTA = 'Se busca señorita para atención al cliente. Requisitos: buena presencia, soltera y sin hijos.';

describe('HU-04 · Aplicar sugerencias con control de versiones', () => {
  test('Criterio 1 (positivo): aceptar reemplaza solo el fragmento y crea la versión 2', () => {
    let historial = V.crearHistorial(OFERTA);
    const [senorita] = analizarOferta(OFERTA);
    const nuevo = V.aplicarSugerencia(OFERTA, senorita, senorita.reemplazo);
    historial = V.agregarVersion(historial, nuevo, 'Sugerencia aplicada');

    expect(nuevo).toBe('Se busca persona para atención al cliente. Requisitos: buena presencia, soltera y sin hijos.');
    expect(V.versionActual(historial).numero).toBe(2);
    expect(V.original(historial).texto).toBe(OFERTA);
  });

  test('Criterio 2 (negativo): cancelar no altera el texto ni el resultado', () => {
    const historial = V.crearHistorial(OFERTA);
    expect(V.versionActual(historial).texto).toBe(OFERTA);
    expect(analizarOferta(V.versionActual(historial).texto)).toHaveLength(analizarOferta(OFERTA).length);
  });

  test('el texto editado por la persona reemplaza a la sugerencia por defecto', () => {
    const [senorita] = analizarOferta(OFERTA);
    expect(V.aplicarSugerencia(OFERTA, senorita, ' persona con experiencia ')).toContain('busca persona con experiencia para');
  });

  test('un reemplazo vacío elimina el fragmento sin dejar comas ni espacios dobles', () => {
    const hallazgos = analizarOferta(OFERTA);
    const soltera = hallazgos.find((h) => h.frase === 'soltera');
    const resultado = V.aplicarSugerencia(OFERTA, soltera, '');
    expect(resultado).toBe('Se busca señorita para atención al cliente. Requisitos: buena presencia y sin hijos.');
    expect(resultado).not.toMatch(/ {2}|, ,/);
  });

  test('Criterio frontera: dos fragmentos contiguos se corrigen en secuencia con posiciones recalculadas', () => {
    let texto = OFERTA;
    let pendientes = analizarOferta(texto).filter((h) => h.reemplazo === '');
    let versiones = V.crearHistorial(texto);
    while (pendientes.length > 0) {
      texto = V.aplicarSugerencia(texto, pendientes[0], '');
      versiones = V.agregarVersion(versiones, texto, 'Eliminación');
      pendientes = analizarOferta(texto).filter((h) => h.reemplazo === '');
    }
    expect(texto).toBe('Se busca señorita para atención al cliente. Requisitos: buena presencia.');
    expect(V.original(versiones).texto).toBe(OFERTA);
  });

  test('rechaza un hallazgo que ya no corresponde al texto actual', () => {
    const [senorita] = analizarOferta(OFERTA);
    expect(() => V.aplicarSugerencia('Otro texto distinto de la oferta', senorita, 'persona')).toThrow('vuelve a analizar');
  });

  test('restaurar el original agrega una versión nueva con el texto inicial (trazabilidad)', () => {
    let historial = V.crearHistorial(OFERTA);
    historial = V.agregarVersion(historial, 'texto cambiado', 'Sugerencia aplicada');
    historial = V.restaurarOriginal(historial);
    expect(V.versionActual(historial)).toEqual({ numero: 3, texto: OFERTA, descripcion: 'Restauración del texto original' });
  });

  test('no permite crear un historial sin texto original', () => {
    expect(() => V.crearHistorial('   ')).toThrow(TypeError);
  });
});
