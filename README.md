# Docker + Kubernetes Playground 🐳☸️

A minimal Node.js service used to practise the container-to-cluster path: multi-stage-safe images, Compose with a health-gated dependency, an Nginx reverse proxy, and Kubernetes manifests with probes and resource limits.

[![CI](https://github.com/zaidnadaf0/docker-k8s-playground/actions/workflows/ci.yml/badge.svg)](https://github.com/zaidnadaf0/docker-k8s-playground/actions/workflows/ci.yml)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?logo=kubernetes&logoColor=white)](https://kubernetes.io)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

## What it demonstrates

- A **Dockerfile** that installs from a committed lockfile (`npm ci --omit=dev`), runs as the non-root `node` user and declares a `HEALTHCHECK`
- **docker-compose** wiring app + Nginx with `depends_on: condition: service_healthy`, so traffic only flows once the app is actually healthy
- **Kubernetes** `Deployment` with 3 replicas, liveness and readiness probes on `/health`, resource requests/limits, and a hardened pod security context
- **CI** that builds the image, runs it, asserts `/health`, validates the Compose file and strictly validates the manifests with kubeconform

## Endpoints

| Path | Response |
|---|---|
| `/` | HTML page showing the container's hostname and current time |
| `/health` | `{"status":"ok","hostname":"<pod-or-container-host>"}` |

The hostname in the response is what makes replica load-balancing visible.

## Architecture

```
             ┌──────────────────────────────────────────┐
 client ───► │ Nginx (compose) / Service (k8s)          │
             │   :80 → targetPort 3000                  │
             └───────────────┬──────────────────────────┘
                             ▼
             ┌──────────────────────────────────────────┐
             │ Deployment: k8s-playground (3 replicas)  │
             │  probes: /health · cpu 100m-250m         │
             └──────────────────────────────────────────┘
```

## Quick start with Docker Compose

```bash
docker compose up --build
curl http://localhost/health
# {"status":"ok","hostname":"..."}
docker compose down
```

## Run with Kubernetes

```bash
# 1. build the image into your local cluster's runtime
#    (kind)
kind create cluster
kind load docker-image k8s-playground:latest
#    (minikube)
# minikube start && eval $(minikube docker-env) && docker build -t k8s-playground:latest ./app

# 2. deploy
kubectl apply -f k8s/

# 3. reach it
kubectl port-forward svc/k8s-playground 8080:80
curl http://localhost:8080/health
```

`k8s/service.yaml` uses `type: LoadBalancer`; on kind use the port-forward above, on minikube `minikube tunnel` will provision an address. The manifests are validated in CI with `kubeconform -strict`.

## Tests

```bash
cd app
npm ci
npm test     # node --test server.test.js
```

The suite imports the server, binds it to an ephemeral port, asserts the HTML page and the `/health` JSON (including that `hostname` is present), then closes it. `app/server.js` only binds a port when run directly, so the test process always exits.

## Project structure

```
docker-k8s-playground/
├── app/
│   ├── server.js          # http server, exported for tests
│   ├── server.test.js     # node:test suite
│   ├── package.json
│   ├── package-lock.json
│   └── Dockerfile
├── k8s/
│   ├── deployment.yaml    # 3 replicas, probes, limits, securityContext
│   └── service.yaml
├── nginx/default.conf     # reverse proxy to app:3000
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Verification status

Locally verified: `node --test` passes in `app/` and every YAML file parses. Docker image build and the Kubernetes dry-runs are verified by the workflow in `.github/workflows/ci.yml`, which runs `docker build`, a live container health check, `docker compose config` and `kubeconform -strict`. No cluster was created from this repository, so no running-cluster screenshots are claimed.

## License

[Apache License 2.0](LICENSE)

## Author

**Mohammed Zaid Nadaf** — [GitHub](https://github.com/zaidnadaf0) · [LinkedIn](https://www.linkedin.com/in/mohammed-zaid-nadaf-1333b0368/)
