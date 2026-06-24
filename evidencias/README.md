# 📸 Carpeta de Evidencias — Anexos del Informe de Auditoría

Esta carpeta contiene las **evidencias fotográficas** que respaldan los hallazgos del Informe de Auditoría de Tecnologías de la Información del Sistema "EPIS Pilot".

## Evidencias Requeridas

Coloca aquí las capturas de pantalla con los siguientes nombres:

| Archivo | Descripción | Hallazgo | Objetivo |
|---------|-------------|---------|---------|
| `evidencia_01_docker_ps.png` | Terminal mostrando `docker ps` con 3 contenedores "Up" | Hallazgo 1 | OE1 |
| `evidencia_02_respuesta_ia.png` | Interfaz web con respuesta del bot a una consulta | Hallazgo 2 | OE2 |
| `evidencia_03_ticket_creado.png` | Mensaje de confirmación "Ticket #X creado" en el chat | Hallazgo 3 | OE3 |
| `evidencia_04_historial_tickets.png` | Pestaña "Historial de Tickets" con ticket registrado | Hallazgo 3 | OE3 |
| `evidencia_05_interfaz_web.png` | Vista general de la interfaz corporativa EPIS Pilot | Hallazgo 4 | OE4 |

## Cómo obtener cada evidencia

### Evidencia 1 — Docker PS
```powershell
docker ps
# Toma captura de pantalla del resultado
```

### Evidencia 2 — Respuesta de IA
- Abre `http://localhost:5173`
- Escribe una consulta como "¿Cuáles son las políticas de teletrabajo?"
- Toma captura de la respuesta del bot

### Evidencia 3 — Ticket Creado
1. En el chat, escribe: `No puedo conectarme a la red WiFi`
2. Click en "❌ No, necesito más ayuda"
3. Click en "🎫 Abrir un Ticket"
4. Escribe: `Mi computadora no reconoce la red WiFi desde ayer en la mañana`
5. Toma captura del mensaje de confirmación con el número de ticket

### Evidencia 4 — Historial de Tickets
- En el sidebar izquierdo, click en "Historial de Tickets"
- Toma captura mostrando el ticket recién creado

### Evidencia 5 — Interfaz Web
- Toma captura general de la pantalla completa de `http://localhost:5173`

---

*Estas evidencias son los **Anexos oficiales** del Informe de Auditoría.*
