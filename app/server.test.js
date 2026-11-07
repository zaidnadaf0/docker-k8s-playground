const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const { server } = require('./server');

describe('Playground app', () => {
  let baseUrl;

  before(async () => {
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  after(async () => {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it('serves an HTML page that reports the pod hostname', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.strictEqual(res.status, 200);
    assert.match(res.headers.get('content-type'), /text\/html/);
    assert.match(await res.text(), /Docker \+ Kubernetes Playground/);
  });

  it('exposes a health endpoint with status and hostname', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.status, 'ok');
    assert.ok(body.hostname, 'hostname should be present in health payload');
  });
});
