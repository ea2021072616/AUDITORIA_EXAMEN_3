# 🔗 Repositorio GitHub: [https://github.com/ea2021072616/AUDITORIA_EXAMEN_3](https://github.com/ea2021072616/AUDITORIA_EXAMEN_3.git)

---

# INFORME DE AUDITORÍA DE TECNOLOGÍAS DE LA INFORMACIÓN

---

## CARÁTULA

### AUDITORÍA DE OPERATIVIDAD Y DESEMPEÑO DE TECNOLOGÍAS DE LA INFORMACIÓN AL SISTEMA DE MESA DE AYUDA CON INTELIGENCIA ARTIFICIAL
### Lima, Perú
*(Distrito de Lima, Provincia de Lima, Departamento de Lima)*

### "EVALUACIÓN DEL DESPLIEGUE, INTEGRACIÓN Y FUNCIONALIDAD DEL SISTEMA DE MESA DE AYUDA CON IA — MODELO smollm:360m"

### Lima, 24 de junio de 2026

### "DECENIO DE LA IGUALDAD DE OPORTUNIDADES PARA MUJERES Y HOMBRES"
### "AÑO DE LA RECUPERACIÓN Y CONSOLIDACIÓN DE LA ECONOMÍA PERUANA"

---

## ÍNDICE

| DENOMINACIÓN                                              | Sección |
|-----------------------------------------------------------|---------|
| I. ORIGEN                                                 | I       |
| II. INFORMACIÓN DE LA ENTIDAD O DEPENDENCIA              | II      |
| III. DENOMINACIÓN DE LA MATERIA DE CONTROL               | III     |
| IV. ALCANCE                                               | IV      |
| V. OBJETIVOS                                              | V       |
| VI. HALLAZGOS Y EVIDENCIAS                               | VI      |
| VII. PROCEDIMIENTOS DE AUDITORÍA                         | VII     |
| VIII. PLAZO DE LA AUDITORÍA Y CRONOGRAMA                 | VIII    |
| IX. CRITERIOS DE AUDITORÍA                               | IX      |
| X. INFORMACIÓN ADMINISTRATIVA                            | X       |
| XI. CONCLUSIONES Y RECOMENDACIONES                       | XI      |
| XII. DOCUMENTO A EMITIR                                  | XII     |
| ANEXOS / EVIDENCIAS                                       | Anexos  |

---

## I. ORIGEN

La presente Auditoría de Tecnologías de la Información (TI) es un servicio de control específico realizado sobre el **"Sistema de Mesa de Ayuda con Inteligencia Artificial"** desplegado en el entorno académico de la Escuela Profesional de Ingeniería de Sistemas (EPIS). El origen de esta auditoría se enmarca en el proceso de evaluación del Examen N.º 3 del curso de Auditoría de Sistemas, cuyo propósito es verificar la correcta implementación, configuración y operatividad de un sistema basado en contenedores Docker con integración de un modelo de lenguaje local (`smollm:360m`) gestionado mediante Ollama.

La necesidad de esta auditoría surge de los siguientes factores:
- La adopción de arquitecturas de software modernas basadas en microservicios y contenedores Docker.
- La integración de modelos de inteligencia artificial de lenguaje natural (LLM) en sistemas de soporte técnico.
- La obligatoriedad de garantizar la disponibilidad y funcionalidad del sistema al 100% como requisito académico evaluado.

---

## II. INFORMACIÓN DE LA ENTIDAD O DEPENDENCIA

- **Entidad/Dependencia**: Escuela Profesional de Ingeniería de Sistemas — EPIS Corp (Simulacro académico)
- **Sistema Auditado**: Mesa de Ayuda con Inteligencia Artificial — "EPIS Pilot"
- **Sector**: Educación Superior / Tecnologías de la Información
- **Nivel**: Académico — Entorno Local de Desarrollo y Pruebas
- **Repositorio GitHub**: [https://github.com/ea2021072616/AUDITORIA_EXAMEN_3](https://github.com/ea2021072616/AUDITORIA_EXAMEN_3.git)
- **Tecnologías Evaluadas**:
  - Backend: Python 3.12 + FastAPI + LangChain + ChromaDB
  - Frontend: React 19 + TypeScript + Material UI
  - Proxy: NGINX (stable-alpine)
  - Orquestación: Docker Compose
  - Modelo IA: `smollm:360m` vía Ollama
  - Base de Datos: SQLite (`tickets.db`)
  - Embeddings: `intfloat/multilingual-e5-large`

---

## III. DENOMINACIÓN DE LA MATERIA DE CONTROL

**"Evaluación del Despliegue, Operatividad e Integración del Sistema de Mesa de Ayuda con Inteligencia Artificial, utilizando el modelo de lenguaje smollm:360m sobre infraestructura de contenedores Docker, en el entorno académico de EPIS Corp"**

Esta materia de control abarca la revisión de:
1. La orquestación de contenedores mediante `docker-compose`.
2. La integración del modelo de lenguaje local `smollm:360m` con el backend FastAPI.
3. El flujo completo de atención al usuario: consulta → clasificación → respuesta → generación de ticket.
4. La persistencia de datos en la base de datos SQLite.
5. El enrutamiento web a través del proxy NGINX.

---

## IV. ALCANCE

La auditoría de Tecnologías de la Información cubre el ciclo de vida completo del **Sistema de Mesa de Ayuda con IA "EPIS Pilot"**, evaluando los siguientes componentes y procesos:

| Componente | Descripción | Incluido |
|------------|-------------|----------|
| Contenedor Backend | Servicio FastAPI con LangChain y ChromaDB | ✅ |
| Contenedor Frontend | Aplicación React servida por NGINX | ✅ |
| Contenedor Proxy | NGINX como reverse proxy en puerto 5173 | ✅ |
| Modelo IA Ollama | smollm:360m en host local (puerto 11434) | ✅ |
| Base de Datos SQLite | Registro y consulta de tickets de soporte | ✅ |
| Vector Store | ChromaDB con embeddings multilingual-e5-large | ✅ |
| Endpoint `/ask` | Clasificación de intenciones y respuestas RAG | ✅ |
| Endpoint `/tickets` | Historial de tickets generados | ✅ |
| Interfaz de Usuario | Chat corporativo con historial y creación de tickets | ✅ |

**Período auditado**: 24 de junio de 2026  
**Entorno**: Local (localhost:5173) — Docker Desktop en Windows 11

---

## V. OBJETIVOS

### Objetivo General

Evaluar la correcta operatividad, disponibilidad y funcionalidad del **Sistema de Mesa de Ayuda con Inteligencia Artificial "EPIS Pilot"**, verificando que el despliegue mediante contenedores Docker, la integración del modelo `smollm:360m` y el flujo completo de atención al usuario —incluyendo la generación y registro de tickets de soporte— funcionen de manera íntegra y al 100%, conforme a las mejores prácticas de desarrollo de software y auditoría de sistemas de TI.

### Objetivos Específicos

1. **OE1 — Verificar el despliegue y disponibilidad de la infraestructura de contenedores Docker** (Backend, Frontend y Proxy NGINX), comprobando que todos los servicios se inicien correctamente y permanezcan operativos sin errores críticos en los logs del sistema.

2. **OE2 — Comprobar la integración funcional del modelo de lenguaje local `smollm:360m`** con el backend FastAPI a través de Ollama, validando que el sistema procese peticiones de usuario, clasifique intenciones (consulta general, reporte de problema, despedida) y genere respuestas coherentes en español.

3. **OE3 — Evaluar el flujo completo de generación y registro de tickets de soporte** en la base de datos SQLite, verificando que el sistema cree correctamente registros de tickets cuando el usuario reporta un problema no resuelto, y que dichos registros sean consultables a través del endpoint `/tickets`.

4. **OE4 — Validar la experiencia de usuario en la interfaz web corporativa**, confirmando que el frontend React renderice correctamente el historial de conversación, los botones de retroalimentación, el panel de historial de tickets, y que el enrutamiento a través del proxy NGINX funcione sin interrupciones.

---

## VI. HALLAZGOS Y EVIDENCIAS

> ⚠️ *Las capturas de pantalla correspondientes a cada hallazgo se encuentran en la carpeta `/evidencias/` de este repositorio.*

---

### Hallazgo 1: Despliegue Correcto de Contenedores Docker

**Descripción:** Se verificó que los tres contenedores del sistema (`backend`, `frontend`, `proxy`) se despliegan correctamente mediante `docker-compose up -d --build`, sin presentar errores críticos. El comando `docker ps` confirma que los tres contenedores se encuentran en estado **"Up"** y operativos.

**Resultado:** ✅ CONFORME

| Contenedor | Imagen | Puerto | Estado |
|-----------|--------|--------|--------|
| auditoria_examen_3-backend-1 | python:3.12-slim | 8000 (interno) | Up |
| auditoria_examen_3-frontend-1 | node:22 + nginx:stable-alpine | 80 (interno) | Up |
| auditoria_examen_3-proxy-1 | nginx:stable-alpine | 5173→80 | Up |

> 📸 **Evidencia 1 (Anexo 1):** Captura del comando `docker ps` mostrando los 3 contenedores en estado "Up".
> *(Ver imagen en `/evidencias/evidencia_01_docker_ps.png`)*

---

### Hallazgo 2: Integración del Modelo smollm:360m con Ollama

**Descripción:** El código fuente en `backend/main.py` fue auditado y se confirmó la instanciación del modelo `smollm:360m` mediante la clase `OllamaLLM` de LangChain. El backend establece comunicación con el daemon Ollama en `http://host.docker.internal:11434`. Los logs del backend registran peticiones HTTP POST exitosas (`HTTP/1.1 200 OK`) al endpoint `/api/generate` de Ollama.

**Observación:** Por ser un modelo de 360 millones de parámetros, `smollm:360m` presenta alucinaciones ocasionales y responde parcialmente en inglés. Se implementaron filtros de post-procesamiento (`clean_llm_output`) y clasificación híbrida (keywords + LLM) para mitigar este comportamiento y garantizar la funcionalidad del sistema.

**Resultado:** ✅ CONFORME CON OBSERVACIÓN

> 📸 **Evidencia 2 (Anexo 2):** Captura de la interfaz web mostrando una respuesta del bot a una consulta del usuario.
> *(Ver imagen en `/evidencias/evidencia_02_respuesta_ia.png`)*

---

### Hallazgo 3: Generación y Registro de Tickets de Soporte

**Descripción:** Se auditó el flujo completo de creación de tickets: el usuario reporta un problema → el sistema clasifica la intención como `reporte_de_problema` → ofrece una solución → el usuario indica que no fue suficiente → el sistema solicita descripción detallada → se ejecuta `ACTION_CREATE_TICKET` → el registro queda almacenado en `tickets.db` con estado "Abierto".

El endpoint `GET /tickets` retorna el historial completo de tickets, accesible también desde la interfaz en la pestaña **"Historial de Tickets"**.

**Resultado:** ✅ CONFORME

```sql
-- Estructura de la tabla tickets en tickets.db
CREATE TABLE tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    status TEXT NOT NULL
);
```

> 📸 **Evidencia 3 (Anexo 3):** Captura del mensaje de confirmación "He creado el ticket de soporte #X".
> *(Ver imagen en `/evidencias/evidencia_03_ticket_creado.png`)*

> 📸 **Evidencia 4 (Anexo 4):** Captura de la pestaña "Historial de Tickets" mostrando el ticket registrado.
> *(Ver imagen en `/evidencias/evidencia_04_historial_tickets.png`)*

---

### Hallazgo 4: Enrutamiento y Funcionalidad de la Interfaz Web

**Descripción:** El proxy NGINX enruta correctamente las peticiones: `/api/*` → backend (puerto 8000), `/metrics` → métricas Prometheus, `/` → frontend (puerto 80). La interfaz web corporativa "EPIS Pilot" se renderiza en `http://localhost:5173` con diseño corporativo azul oscuro, sidebar de navegación, avatares de bot/usuario, historial de conversación en tiempo real, y panel de tickets.

**Resultado:** ✅ CONFORME

> 📸 **Evidencia 5 (Anexo 5):** Captura de la interfaz web corporativa EPIS Pilot funcionando en el navegador.
> *(Ver imagen en `/evidencias/evidencia_05_interfaz_web.png`)*

---

## VII. PROCEDIMIENTOS DE AUDITORÍA

**Cuadro n.º 1 – Procedimientos**

| Obj. Específico | Procedimientos Aplicados | Responsable |
|-----------------|--------------------------|-------------|
| **OE1** | 1. Ejecución de `docker-compose up -d --build` y verificación con `docker ps`. | Auditor |
|          | 2. Revisión de logs con `docker logs auditoria_examen_3-backend-1` para identificar errores. | Auditor |
|          | 3. Verificación de puertos expuestos y conectividad de red entre contenedores. | Auditor |
| **OE2** | 1. Revisión del código `backend/main.py` para confirmar uso de `OllamaLLM(model="smollm:360m")`. | Auditor |
|          | 2. Prueba funcional enviando consultas al endpoint `GET /api/ask?question=...` desde la interfaz web. | Auditor |
|          | 3. Verificación en logs del backend de peticiones exitosas a Ollama (`HTTP/1.1 200 OK`). | Auditor |
| **OE3** | 1. Ejecución del flujo completo: reporte de problema → feedback negativo → descripción → ticket. | Auditor |
|          | 2. Verificación del ticket en el endpoint `GET /api/tickets`. | Auditor |
|          | 3. Consulta directa a la base de datos SQLite para confirmar persistencia del registro. | Auditor |
| **OE4** | 1. Acceso a `http://localhost:5173` y verificación de carga del frontend. | Auditor |
|          | 2. Prueba de navegación entre pestañas "Chat de Soporte" e "Historial de Tickets". | Auditor |
|          | 3. Verificación del historial de mensajes en la interfaz tras múltiples interacciones. | Auditor |

---

## VIII. PLAZO DE LA AUDITORÍA Y CRONOGRAMA

| Etapa                      | Fecha de Inicio | Fecha de Finalización |
|----------------------------|-----------------|----------------------|
| Planificación              | 24/06/2026      | 24/06/2026           |
| Ejecución (Despliegue)     | 24/06/2026      | 24/06/2026           |
| Ejecución (Pruebas)        | 24/06/2026      | 24/06/2026           |
| Elaboración del Informe    | 24/06/2026      | 24/06/2026           |

---

## IX. CRITERIOS DE AUDITORÍA

La auditoría se llevó a cabo con base en los siguientes criterios:

- **ITIL v4**: Gestión de incidentes y solicitudes de servicio — aplicado al flujo de tickets de soporte.
- **ISO/IEC 27001**: Controles de seguridad de la información — revisión de políticas CORS, acceso a datos y gestión de logs.
- **COBIT 2019**: Gobierno y gestión de TI — evaluación de la entrega de servicios de TI y gestión de riesgos tecnológicos.
- **Mejores prácticas DevOps**: Uso de contenedores Docker, versionamiento con Git/GitHub, separación de responsabilidades por servicio.
- **Normativas de desarrollo seguro**: Revisión de cabeceras HTTP, configuración del proxy NGINX y exposición de endpoints.

---

## X. INFORMACIÓN ADMINISTRATIVA

### X.1 Comisión Auditora

**Cuadro n.º 2 – Comisión Auditora**

| Cargo           | Nombres y Apellidos       | Profesión                    | Planificación | Ejecución | Informe | Total |
|-----------------|---------------------------|------------------------------|---------------|-----------|---------|-------|
| Docente/Supervisor | [Nombre del Docente]   | Ingeniero de Sistemas        | 1 día         | 1 día     | 1 día   | 3 días |
| Jefe de Comisión | [Nombre del Estudiante]  | Estudiante de Ing. Sistemas  | 1 día         | 1 día     | 1 día   | 3 días |

### X.2 Costos Directos Estimados

**Cuadro n.º 3 – Costo Estimado**

| N° | Recurso                          | Tipo       | Costo Estimado (S/.) |
|----|----------------------------------|------------|----------------------|
| 1  | Tiempo del estudiante (auditor)  | Hora/Hombre | S/. 0.00 (académico) |
| 2  | Licencias de software            | Software   | S/. 0.00 (open source) |
| 3  | Infraestructura (Docker local)   | Hardware   | S/. 0.00 (equipo propio) |
| 4  | Modelo smollm:360m (Ollama)      | IA/Software | S/. 0.00 (gratuito) |
|    | **Total**                        |            | **S/. 0.00**         |

*Elaborado por: Comisión Auditora a cargo de la Auditoría en TI.*

---

## XI. CONCLUSIONES Y RECOMENDACIONES

### Conclusiones

1. **Infraestructura Docker (OE1):** El sistema se despliega correctamente con `docker-compose`, los tres contenedores operan de manera estable y el proxy NGINX enruta correctamente las peticiones. Se concluye que la infraestructura de contenedores cumple con los requisitos de disponibilidad.

2. **Modelo smollm:360m (OE2):** El modelo se integra correctamente con el backend mediante Ollama. Dada su arquitectura de 360M parámetros, presenta limitaciones en la calidad de respuestas (alucinaciones, mezcla de idiomas), comportamiento esperado y documentado. Los filtros de post-procesamiento implementados mitigan estos efectos, garantizando la funcionalidad del sistema.

3. **Sistema de Tickets (OE3):** El flujo de creación de tickets funciona al 100%. Los registros se almacenan correctamente en SQLite y son recuperables via API. El historial de tickets es visible en tiempo real desde la interfaz web.

4. **Interfaz Web (OE4):** La interfaz corporativa "EPIS Pilot" presenta un diseño profesional, el historial de conversación funciona correctamente y la navegación entre secciones opera sin errores.

### Recomendaciones

1. **Modelo IA:** Para producción, migrar a un modelo de mayor capacidad (mínimo 7B parámetros, como `llama3.1:8b`) para obtener respuestas de mejor calidad en español.
2. **Seguridad:** Implementar autenticación en los endpoints de la API antes de desplegar en entornos productivos.
3. **Base de Datos:** Migrar de SQLite a PostgreSQL para entornos de producción con múltiples usuarios concurrentes.
4. **Monitoreo:** Aprovechar el endpoint de métricas Prometheus ya integrado para configurar dashboards de monitoreo con Grafana.
5. **Documentación:** Mantener actualizada la documentación técnica y el `README.md` con cada cambio significativo del sistema.

---

## XII. DOCUMENTO A EMITIR

Como resultado de esta auditoría, se emite el presente **Informe de Auditoría de Tecnologías de la Información**, que documenta los hallazgos, evidencias, conclusiones y recomendaciones relacionadas con el despliegue y operación del Sistema de Mesa de Ayuda con IA "EPIS Pilot" en el entorno académico de EPIS Corp.

---

**Lima, 24 de junio de 2026**

**[Nombre del Estudiante]**
Jefe de Comisión — Auditoría de Sistemas

**[Nombre del Docente]**
Supervisor — Docente del Curso de Auditoría de Sistemas

---

## ANEXOS / EVIDENCIAS

> 📁 Las evidencias fotográficas se encuentran en la carpeta [`/evidencias/`](./evidencias/) de este repositorio.

### Anexo 1 — Evidencia 1: Contenedores Docker en ejecución
**Descripción:** Captura del terminal mostrando `docker ps` con los 3 contenedores en estado "Up".  
**Archivo:** `/evidencias/evidencia_01_docker_ps.png`  
**Objetivo relacionado:** OE1 — Verificar el despliegue de contenedores.

---

### Anexo 2 — Evidencia 2: Respuesta del modelo smollm:360m
**Descripción:** Captura de la interfaz web mostrando una respuesta del asistente EPIS Pilot a una consulta del usuario.  
**Archivo:** `/evidencias/evidencia_02_respuesta_ia.png`  
**Objetivo relacionado:** OE2 — Integración del modelo IA.

---

### Anexo 3 — Evidencia 3: Creación exitosa de ticket de soporte
**Descripción:** Captura de la interfaz mostrando el mensaje "He creado el ticket de soporte #X" tras el flujo completo de reporte.  
**Archivo:** `/evidencias/evidencia_03_ticket_creado.png`  
**Objetivo relacionado:** OE3 — Generación y registro de tickets.

---

### Anexo 4 — Evidencia 4: Historial de tickets en la interfaz
**Descripción:** Captura de la pestaña "Historial de Tickets" en el sidebar, mostrando el/los ticket(s) registrado(s) con su número, descripción y estado.  
**Archivo:** `/evidencias/evidencia_04_historial_tickets.png`  
**Objetivo relacionado:** OE3 — Consulta del historial de tickets.

---

### Anexo 5 — Evidencia 5: Interfaz web corporativa funcionando
**Descripción:** Captura de la interfaz completa del sistema "EPIS Pilot" corriendo en `http://localhost:5173`, mostrando el diseño corporativo, el sidebar y el chat.  
**Archivo:** `/evidencias/evidencia_05_interfaz_web.png`  
**Objetivo relacionado:** OE4 — Validar la experiencia de usuario.

---

### Anexo 6 — Matriz de Riesgos Identificados

| N° | Riesgo | Causa | Impacto | Nivel | Control Implementado |
|----|--------|-------|---------|-------|---------------------|
| 1 | Alucinaciones del modelo LLM | Limitada capacidad de smollm:360m | Respuestas incorrectas al usuario | Alto | Filtros de post-procesamiento + clasificación por keywords |
| 2 | Bucle infinito en respuestas | Comportamiento del modelo pequeño | Timeout del frontend / UX degradada | Alto | Función `clean_llm_output` con corte en delimitadores |
| 3 | Pérdida de datos de tickets | Uso de SQLite sin respaldo | Pérdida de registros de soporte | Medio | Persistencia en volumen Docker |
| 4 | Disponibilidad del servicio Ollama | Dependencia de servicio externo al contenedor | Sistema inoperativo | Alto | Manejo de excepciones con respuesta de error controlada |
| 5 | Falta de autenticación en API | Endpoints públicos sin control de acceso | Acceso no autorizado a datos | Medio | Mitigado en entorno local; pendiente para producción |

---

### Anexo 7 — Configuración del Sistema Auditado

```yaml
# Arquitectura del sistema (docker-compose.yml)
Servicios:
  - backend:  FastAPI + LangChain + ChromaDB (puerto 8000 interno)
  - frontend: React + MUI → compilado por Node.js, servido por NGINX
  - proxy:    NGINX → expone puerto 5173, enruta /api/* y /metrics

Modelo IA:
  - Nombre: smollm:360m
  - Proveedor: Ollama (host local, puerto 11434)
  - Embeddings: intfloat/multilingual-e5-large

Base de Datos:
  - Motor: SQLite
  - Archivo: tickets.db
  - Tabla: tickets (id, description, status)
```

---

*Informe elaborado como parte del Examen N.º 3 del curso de Auditoría de Sistemas — EPIS Corp, 2026.*