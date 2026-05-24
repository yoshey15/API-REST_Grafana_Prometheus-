# Taller — Monitoreo y Observabilidad

**Nombre:** Andres Felipe Cardoso Bernal
**Código:** 202210005601

## Cómo correr el proyecto

```bash
docker-compose up -d
```

## Servicios

| Servicio | URL |
|----------|-----|
| API | http://localhost:3000 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3001 (admin/admin) |

## Endpoints de la API

| Endpoint | Descripción |
|----------|-------------|
| `GET /` | Endpoint principal |
| `GET /api/datos` | Retorna lista de datos (rápido) |
| `GET /api/lento` | Simula procesamiento lento (2-3 seg) |
| `GET /metrics` | Métricas en formato Prometheus |

## Querys
rate(http_requests_total[1m])
rate(http_request_duration_seconds_sum[1m]) / rate(http_request_duration_seconds_count[1m])
http_active_requests

## Generar tráfico sintético

```Powershell
while ($true) { try { Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing | Out-Null; Invoke-WebRequest -Uri "http://localhost:3000/api/datos" -UseBasicParsing | Out-Null; Invoke-WebRequest -Uri "http://localhost:3000/api/lento" -UseBasicParsing | Out-Null; Write-Host "Request enviado..." } catch { Write-Host "Error" }; Start-Sleep -Seconds 1 }

```

## Detener

```bash
docker-compose down
```
