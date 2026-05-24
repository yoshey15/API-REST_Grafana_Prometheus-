# Monitoreo y Observabilidad — API REST con Prometheus y Grafana

**Nombre:** Andres Felipe Cardoso Bernal
**Código:** 202210005601
**Asignatura:** Herramientas y Visualización de Datos  
**Fecha:** Mayo 2026

---

## ¿Qué hace este proyecto?

Implementa un sistema de monitoreo completo para una API REST construida en Node.js + Express. La API expone métricas en formato Prometheus que son recolectadas y visualizadas en tiempo real desde Grafana. Todo corre en contenedores Docker orquestados con docker-compose.

```
API (Node.js) → expone /metrics → Prometheus recolecta → Grafana visualiza
```

---

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- No se requiere instalar Node.js ni ninguna otra dependencia

---

## Cómo correr el proyecto

**1. Entrar a la carpeta del proyecto:**
```bash
cd taller-monitoreo/taller
```

**2. Levantar todos los servicios:**
```bash
docker-compose up -d
```

**3. Verificar que estén corriendo:**
```bash
docker-compose ps
```

Espera ~30 segundos. Luego abre en el navegador:

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| API | http://localhost:3000 | — |
| Prometheus | http://localhost:9090 | — |
| Grafana | http://localhost:3001 | admin / admin |

---

## Endpoints de la API

| Método | Endpoint | Descripción | Latencia |
|--------|----------|-------------|----------|
| GET | `/` | Información general de la API | < 5ms |
| GET | `/api/datos` | Retorna lista de productos | < 5ms |
| GET | `/api/lento` | Simula procesamiento pesado | 2–3 seg |
| GET | `/metrics` | Métricas en formato Prometheus | < 5ms |

---

## Métricas implementadas

| Métrica | Tipo | Descripción |
|---------|------|-------------|
| `http_requests_total` | Counter | Total de requests por endpoint, método y status |
| `http_request_duration_seconds` | Histogram | Latencia de cada request en segundos |
| `http_active_requests` | Gauge | Requests siendo procesados en este momento |

---

## Generar tráfico sintético

**En Windows (PowerShell):**
```powershell
while ($true) { try { Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing | Out-Null; Invoke-WebRequest -Uri "http://localhost:3000/api/datos" -UseBasicParsing | Out-Null; Invoke-WebRequest -Uri "http://localhost:3000/api/lento" -UseBasicParsing | Out-Null; Write-Host "Request enviado..." } catch { Write-Host "Error" }; Start-Sleep -Seconds 1 }

````

Para detener: presiona **Ctrl + C**

---

## Queries PromQL útiles

```promql
# Requests por segundo por endpoint
rate(http_requests_total[1m])

# Latencia promedio por endpoint
rate(http_request_duration_seconds_sum[1m]) / rate(http_request_duration_seconds_count[1m])

# Requests activos en este momento
http_active_requests
```

---

## Dashboard de Grafana

El dashboard **"Monitoreo API"** contiene 3 paneles:

1. **Requests por segundo** — tasa de tráfico por endpoint
2. **Latencia promedio** — tiempo de respuesta (se aprecia claramente la diferencia entre `/api/lento` y los demás)
3. **Requests activos** — concurrencia en tiempo real

---

## Detener los servicios

```bash
# Detener sin borrar datos
docker-compose stop

# Detener y borrar todo (reinicio limpio)
docker-compose down -v
```

---

## Estructura del proyecto

```
taller/
├── docker-compose.yml        # Orquestación de los 3 servicios
├── README.md
├── api/
│   ├── Dockerfile            # Imagen de la API
│   ├── package.json          # Dependencias Node.js
│   └── server.js             # Código fuente con métricas
├── prometheus/
│   └── prometheus.yml        # Configuración de scraping
└── scripts/
    └── generate-traffic.sh   # Script de tráfico (Linux/Mac)
```
