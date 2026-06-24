[Link al repositorio de GitHub: https://github.com/ea2021072616/AUDITORIA_EXAMEN_3.git](https://github.com/ea2021072616/AUDITORIA_EXAMEN_3.git)

# INFORME DE AUDITORÍA DE TECNOLOGÍAS DE LA INFORMACIÓN

## I. ORIGEN
La Auditoría de Tecnologías de la Información (TI) se realiza sobre el "Sistema de Mesa de Ayuda con IA" para evaluar la efectividad, funcionamiento y configuración del entorno de despliegue, incluyendo la integración de modelos de lenguaje local (smollm:360m). Esta auditoría se ha desarrollado cumpliendo las directrices del plan general de auditorías.

## II. OBJETIVOS

### Objetivo General
Evaluar el funcionamiento, despliegue y configuración del "Sistema de Mesa de Ayuda con IA" utilizando el modelo `smollm:360m`, garantizando su disponibilidad y correcta operatividad al 100%.

### Objetivos Específicos
1. Verificar la correcta configuración y despliegue de los contenedores Docker (Frontend, Backend, Proxy) del sistema.
2. Comprobar la integración y correcta respuesta del modelo de lenguaje local `smollm:360m` a través de Ollama en el componente backend.
3. Evaluar el registro adecuado de tickets en la base de datos (SQLite) generados a partir de las interacciones resolutivas con el asistente de IA.
4. Validar el enrutamiento correcto de la interfaz web hacia el backend utilizando el Proxy (NGINX) configurado.

## III. ALCANCE
La auditoría cubre la revisión del código fuente, la configuración de los servicios (Docker, Docker-Compose), la integración del modelo de IA (`smollm:360m`) en el backend, la interacción de principio a fin desde el frontend y la persistencia de datos en la base de datos local (`tickets.db`), durante el entorno de ejecución en modo local.

## IV. HALLAZGOS Y EVIDENCIAS
(Las capturas de pantalla y evidencias gráficas se adjuntan en la carpeta `/evidencias/`)

**Hallazgo 1: Despliegue de Contenedores**
Se comprobó que los servicios de backend, frontend y proxy se levantan correctamente sin presentar errores en los logs utilizando la orquestación con `docker-compose`. 
- *Evidencia 1:* Captura del terminal mostrando la ejecución de `docker-compose ps` donde los contenedores están en estado "Up". (Ver en `/evidencias/`)

**Hallazgo 2: Integración del modelo smollm:360m**
El código fuente en `backend/main.py` fue auditado y actualizado para instanciar el modelo `smollm:360m` en la cadena de LangChain. Las pruebas interactivas demuestran que el backend logra comunicarse y obtener respuestas coherentes desde el daemon de Ollama.
- *Evidencia 2:* Captura de la respuesta del modelo interactuando en la interfaz web o captura de la terminal mostrando el log del backend al procesar una petición con `smollm:360m`. (Ver en `/evidencias/`)

**Hallazgo 3: Generación de Tickets en la Base de Datos**
Durante la interacción con el bot, cuando la solución no es suficiente, el sistema habilita la acción `ACTION_CREATE_TICKET`. Se verificó mediante consulta directa que el ticket se almacena consistentemente en la tabla SQLite.
- *Evidencia 3:* Captura de pantalla del explorador de la base de datos (`tickets.db`) mostrando el registro recién ingresado con sus respectivos detalles. (Ver en `/evidencias/`)

**Hallazgo 4: Acceso y Navegación en el Frontend**
La interfaz de React es accesible a través del puerto definido (5173) y enruta de manera transparente hacia el backend pasando por el proxy.
- *Evidencia 4:* Captura de pantalla del frontend operando al 100% en el navegador (`http://localhost:5173`) sin errores de CORS o de red en la consola de desarrollador. (Ver en `/evidencias/`)

## V. CONCLUSIONES
1. **Funcionalidad al 100%:** El Sistema de Mesa de Ayuda con IA fue levantado y puesto en marcha exitosamente, cumpliendo con todos los requerimientos de interacción y arquitectura.
2. **Desempeño del Modelo:** El uso de `smollm:360m` es efectivo para el propósito del proyecto, ofreciendo un excelente balance de rendimiento y bajos requisitos de recursos en el entorno de evaluación local.
3. **Persistencia y Acciones:** El sistema de registro de tickets funciona según lo esperado, confirmando que la lógica de separación de intenciones y el router están operando correctamente.
4. **Despliegue Estandarizado:** La estrategia de dockerización demostró ser robusta y facilita la portabilidad de todo el stack tecnológico.

## VI. RECOMENDACIONES
1. Implementar alertas o monitoreo continuo sobre el consumo de recursos de los contenedores Docker, especialmente la carga de memoria requerida por Ollama al generar inferencias.
2. Establecer una política de respaldos automáticos y periódicos tanto para la base de conocimientos (`vector_store`) como para la base de datos relacional de tickets (`tickets.db`).
3. Reforzar las validaciones de entrada en los endpoints de FastAPI si se proyecta exponer este sistema a entornos de producción o redes públicas.

## VII. ANEXOS (Carpeta `/evidencias/`)
La carpeta `/evidencias/` de este repositorio alberga todas las capturas de pantalla que sustentan los hallazgos señalados en el punto IV.