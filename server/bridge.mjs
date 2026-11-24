/**
 * SHIELD hardware bridge
 * ----------------------
 * A tiny local server that sits between the ESP8266 and the React app.
 *
 *   ESP8266 --HTTP POST /telemetry--> [this server] <--poll-- React app
 *   ESP8266 <--HTTP GET /command----- [this server] <--POST--- React app
 *
 * Run it with:  npm run bridge
 * ESP8266 should POST to: http://<computer-ip>:3003/telemetry
 */

import http from 'node:http';

const PORT = Number(process.env.BRIDGE_PORT || 3003);

let telemetry = {
  battery: null,
  heartRate: null,
  switchPressed: false,
  fallDetected: false,
  shakeDetected: false,
  timestamp: 0,
};

let command = {
  buzzer: false,
  led: 'off', // off | red | green | blue | flashing
  updatedAt: 0,
};

function send(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 8192) req.destroy();
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  const path = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`).pathname;

  try {
    if (path === '/' && req.method === 'GET') {
      return send(res, 200, {
        name: 'SHIELD hardware bridge',
        status: 'running',
        endpoints: ['GET /telemetry', 'POST /telemetry', 'GET /command', 'POST /command'],
      });
    }

    if (path === '/telemetry' && req.method === 'POST') {
      const body = await readBody(req);
      const next = { ...telemetry };

      if (body.battery !== undefined && body.battery !== null) {
        const value = Number(body.battery);
        if (Number.isFinite(value)) next.battery = Math.max(0, Math.min(100, Math.round(value)));
      }
      if (body.heartRate !== undefined && body.heartRate !== null) {
        const value = Number(body.heartRate);
        if (Number.isFinite(value)) next.heartRate = Math.max(0, Math.min(250, Math.round(value)));
      }
      if (body.switchPressed !== undefined) next.switchPressed = Boolean(body.switchPressed);
      if (body.fallDetected !== undefined) next.fallDetected = Boolean(body.fallDetected);
      if (body.shakeDetected !== undefined) next.shakeDetected = Boolean(body.shakeDetected);

      next.timestamp = Date.now();
      const wasPressed = telemetry.switchPressed;
      telemetry = next;

      const stamp = new Date().toLocaleTimeString();
      console.log(`[${stamp}] telemetry`, {
        battery: telemetry.battery,
        heartRate: telemetry.heartRate,
        switch: telemetry.switchPressed ? 'PRESSED' : 'released',
      });
      if (!wasPressed && telemetry.switchPressed) console.log(`[${stamp}] >>> SWITCH PRESS -> SOS <<<`);

      return send(res, 200, { ok: true, timestamp: telemetry.timestamp });
    }

    if (path === '/telemetry' && req.method === 'GET') {
      return send(res, 200, telemetry);
    }

    if (path === '/command' && req.method === 'POST') {
      const body = await readBody(req);
      command = {
        buzzer: Boolean(body.buzzer),
        led: ['off', 'red', 'green', 'blue', 'flashing'].includes(body.led) ? body.led : 'off',
        updatedAt: Date.now(),
      };
      console.log(`[${new Date().toLocaleTimeString()}] command`, command);
      return send(res, 200, { ok: true });
    }

    if (path === '/command' && req.method === 'GET') {
      return send(res, 200, command);
    }

    return send(res, 404, { error: 'Not found' });
  } catch (err) {
    return send(res, 400, { error: 'Invalid JSON body' });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\nSHIELD hardware bridge running on http://localhost:${PORT}`);
  console.log(`On the ESP8266, POST telemetry to: http://<this-computer-ip>:${PORT}/telemetry`);
  console.log('Press Ctrl+C to stop.\n');
});
