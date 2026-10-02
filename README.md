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

- Tablero Scrum: [completar enlace]
- Documentación / Wiki: (https://github.com/MaggLo1080/equihire/wiki/Actas-Sprint-1)
- Tablero de Miro: [completar enlace]

## Sprint 1

**Sprint Goal:** Al finalizar el Sprint, el reclutador podrá analizar una oferta laboral, identificar frases o requisitos con sesgo de género y visualizar el reporte con las recomendaciones de redacción.

**Historias seleccionadas:** HU-01 Análisis de la oferta (5 pts) y HU-02 Índice de riesgo y reporte (3 pts). Total: 8 de 13 puntos de capacidad.

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
