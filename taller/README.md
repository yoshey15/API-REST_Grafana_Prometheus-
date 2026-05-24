# Taller — Monitoreo y Observabilidad

**Nombre:** [Tu nombre]  
**Código:** [Tu código]

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

## Generar tráfico sintético

```bash
bash scripts/generate-traffic.sh
```

## Detener

```bash
docker-compose down
```
