const http = require('http');

const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || 'unknown';

function createServer() {
  return http.createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', hostname: HOSTNAME }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
    <html>
      <head><title>K8s Playground</title></head>
      <body style="font-family:sans-serif;text-align:center;padding:50px">
        <h1>🐳☸️ Docker + Kubernetes Playground</h1>
        <p>Served by: <strong>${HOSTNAME}</strong></p>
        <p>Time: ${new Date().toISOString()}</p>
        <hr/>
        <p><a href="/health">Health Check</a></p>
      </body>
    </html>
  `);
  });
}

const server = createServer();

// Bind a port only when executed directly. Importing this module (the test
// suite does) must not open a socket: a listening server is an open handle
// that prevents the node:test process from exiting.
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (hostname: ${HOSTNAME})`);
  });
}

module.exports = { server, createServer };
