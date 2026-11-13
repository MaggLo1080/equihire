# EquiHire

Plataforma de análisis automatizado de sesgos de género en ofertas laborales.

## Problema

Los equipos de Recursos Humanos y los reclutadores redactan las ofertas laborales de forma manual y no disponen de un mecanismo que les permita detectar si el lenguaje, los requisitos o las condiciones introducen sesgos de género antes de publicarlas. Esto produce vacantes que pueden desalentar la postulación de ciertos perfiles, reducir la diversidad de aspirantes y restar objetividad a los procesos de selección.

## Product Goal

Para los equipos de Recursos Humanos y reclutadores, lograremos que puedan detectar y corregir posibles sesgos de género en sus ofertas laborales antes de publicarlas, mediante un análisis automatizado que calcule un índice de equidad, explique cada hallazgo y sugiera redacciones alternativas, de modo que los procesos de selección sean más objetivos, inclusivos y trazables.

## Scrum Team

| Responsabilidad | Integrante |
|---|---|
| Product Owner | Sebastian Oyaga |
| Scrum Master | Alejandro Borja |
| Developer — Frontend | Alejandro Barros |
| Developer — Backend / NLP | Taliana Reyes |

## Enlaces del proyecto

- Tablero Scrum: https://github.com/users/MaggLo1080/projects/1
- Documentación / Wiki: https://github.com/MaggLo1080/equihire/wiki
- Tablero de Miro: https://miro.com/app/board/uXjVEfXwtHk=/
- Plan de Desarrollo de Software y diagramas UML: carpeta [`docs/`](docs/)

## Sprint 1

**Sprint Goal:** Al finalizar el Sprint, el reclutador podrá analizar una oferta laboral, identificar frases o requisitos con sesgo de género y visualizar el reporte con las recomendaciones de redacción.

**Historias seleccionadas:** HU-01 Análisis de la oferta (5 pts) y HU-02 Índice de riesgo y reporte (3 pts). Total: 8 de 13 puntos de capacidad.

**Resultado:** Sprint Goal alcanzado. HU-01 (PR #16) y HU-02 (PR #17) terminadas, con 15 pruebas automáticas. Actas en la [Wiki](https://github.com/MaggLo1080/equihire/wiki/Actas-Sprint-1).

## Sprint 2

**Sprint Goal:** Definir la trazabilidad necesidad → requisito → SPEC → criterio → prueba y especificar las historias para exportar y corregir la oferta.

**Resultado:** Especificaciones SPEC-016 (HU-16) y SPEC-004 (HU-04), requisitos funcionales y no funcionales, modelo y diccionario de datos.

## Sprint 3

**Sprint Goal:** Que la persona usuaria pueda corregir la oferta aplicando las sugerencias sin perder el original y exportar el reporte a PDF, con la arquitectura y la seguridad documentadas.

**Historias:** HU-04 Aplicar o editar sugerencias (5 pts) y HU-16 Exportar reporte PDF (2 pts).

**Cambios principales:**

- Límite de 10.000 caracteres por oferta con mensaje claro (FR-01).
- Botón **Aplicar sugerencia** en cada hallazgo, con diálogo editable, versiones y opción **Restaurar original** (HU-04, FR-06).
- Botón **Exportar PDF**: genera el reporte con la impresión del navegador; la oferta no sale del equipo (HU-16, FR-08).
- Aviso permanente de resultado orientativo en pantalla y en el PDF (FR-04).
- Política de seguridad de contenido (CSP) y escape de HTML probado (SC-01, SC-04).
- CI con Node.js 24 y auditoría de dependencias (SC-11). 30 pruebas automáticas.

## Definition of Done

- [ ] Criterios de aceptación verificados con evidencia
- [ ] Pull request revisado y aprobado por al menos un Developer distinto al autor
- [ ] Pruebas automáticas superadas, incluidas las pruebas unitarias del módulo NLP
- [ ] Interfaz responsiva probada
- [ ] Sin defectos críticos conocidos ni secretos expuestos
- [ ] Documentación necesaria actualizada
- [ ] Integrado en `main` y disponible para demostrar

## Convenciones del repositorio

**Ramas**

- `main` es la rama principal y está protegida; no se hacen cambios directos.
- Una rama breve por historia: `feature/HU-01-analisis-oferta`, `feature/HU-02-indice-riesgo`.

**Commits**

- Mensajes comprensibles y vinculados a la historia, por ejemplo: `feat(HU-01): detectar frases con sesgo de género`.

**Pull requests**

- Incluyen descripción, historia vinculada, pruebas ejecutadas, captura cuando aplique y el checklist de la Definition of Done.
- Requieren al menos una aprobación antes de fusionarse.

**Secretos y datos de prueba**

- Las credenciales van en un archivo `.env`, incluido en `.gitignore`. Nunca se suben al repositorio.
- Las ofertas de prueba no contienen datos personales reales.

## Cómo usar EquiHire

1. Abre la aplicación publicada o el archivo `index.html` en el navegador. No requiere instalación.
2. Pega el texto completo de la oferta laboral, o usa los botones "Cargar ejemplo con sesgo" o "Cargar ejemplo neutro".
3. Haz clic en **Analizar oferta**.
4. Revisa las frases resaltadas. Cada una tiene un número que corresponde a un hallazgo, con su explicación y una alternativa de redacción inclusiva.
5. Usa **Aplicar sugerencia** en un hallazgo para reemplazar el fragmento. Puedes editar el texto propuesto o dejarlo vacío para eliminarlo. La versión original se conserva y puedes volver a ella con **Restaurar original**.
6. Haz clic en **Exportar PDF** y elige «Guardar como PDF» para descargar el reporte.
7. Haz clic en **Editar texto** para corregir la oferta manualmente y volver a analizarla.

La oferta puede tener hasta 10.000 caracteres. Todo el análisis ocurre en tu navegador: el texto no se envía a ningún servidor.

El análisis se basa en un catálogo de expresiones con posible sesgo de género (`src/catalogo.js`). Señala posibles sesgos para apoyar la revisión; la redacción final es decisión de la persona responsable de la selección.

## Estructura del proyecto

| Archivo | Contenido |
|---|---|
| `index.html` y `styles.css` | Interfaz de la aplicación |
| `src/catalogo.js` | Catálogo de expresiones con su categoría, severidad, explicación y alternativa |
| `src/analizador.js` | Motor de análisis que valida el texto y detecta las expresiones |
| `src/riesgo.js` | Índice de riesgo de equidad y resumen de hallazgos |
| `src/versiones.js` | Aplicación de sugerencias y versiones de la oferta |
| `src/utilidades.js` | Escape de HTML para mostrar el texto de forma segura |
| `src/app.js` | Conexión entre la interfaz y los módulos anteriores |
| `tests/` | Pruebas unitarias con Jest (30 pruebas) |
| `docs/` | Plan de Desarrollo de Software y diagramas UML |

## Cómo ejecutar las pruebas

Requiere Node.js 24 o superior.

    npm install
    npm test

Las pruebas y la auditoría de dependencias (`npm audit`) también se ejecutan automáticamente en cada pull request mediante GitHub Actions.
