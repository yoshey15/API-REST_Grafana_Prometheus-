const express = require('express');
const client = require('prom-client');

const app = express();

// ── Métricas Prometheus ─────────────────────────────────────────────────────
const register = new client.Registry();
client.collectDefaultMetrics({ register }); // CPU, memoria, etc.

const requestCount = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de requests HTTP',
  labelNames: ['method', 'endpoint', 'status'],
  registers: [register],
});

const requestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duración de los requests en segundos',
  labelNames: ['endpoint'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register],
});

const activeRequests = new client.Gauge({
  name: 'http_active_requests',
  help: 'Requests activos en este momento',
  registers: [register],
});

// ── Endpoints ───────────────────────────────────────────────────────────────

// GET / — Endpoint principal
app.get('/', (req, res) => {
  const end = requestDuration.startTimer({ endpoint: '/' });
  activeRequests.inc();
  requestCount.inc({ method: 'GET', endpoint: '/', status: 200 });
  activeRequests.dec();
  end();
  res.json({ message: 'API funcionando', version: '1.0.0' });
});

// GET /api/datos — Responde rápido
app.get('/api/datos', (req, res) => {
  const end = requestDuration.startTimer({ endpoint: '/api/datos' });
  activeRequests.inc();
  const datos = [
    { id: 1, nombre: 'Producto A', precio: 100 },
    { id: 2, nombre: 'Producto B', precio: 200 },
    { id: 3, nombre: 'Producto C', precio: 300 },
  ];
  requestCount.inc({ method: 'GET', endpoint: '/api/datos', status: 200 });
  activeRequests.dec();
  end();
  res.json({ datos });
});

// GET /api/lento — Simula procesamiento pesado (2-3 segundos)
app.get('/api/lento', (req, res) => {
  const end = requestDuration.startTimer({ endpoint: '/api/lento' });
  activeRequests.inc();
  const delay = 2000 + Math.random() * 1000; // 2–3 segundos
  setTimeout(() => {
    requestCount.inc({ method: 'GET', endpoint: '/api/lento', status: 200 });
    activeRequests.dec();
    end();
    res.json({ message: 'Procesamiento lento completado', delay_ms: Math.round(delay) });
  }, delay);
});

// GET /metrics — Expone métricas para Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// ── Iniciar servidor ─────────────────────────────────────────────────────────
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
  console.log(`Métricas en http://localhost:${PORT}/metrics`);
});
