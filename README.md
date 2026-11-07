# Docker + Kubernetes Playground 🐳☸️

A minimal containerized Node.js application used to practice Docker and Kubernetes fundamentals — building images, running containers, composing multi-service apps, and deploying to a cluster.

## 🏗️ Architecture

```
┌─────────────────────────────────┐
│         Kubernetes Cluster       │
│                                  │
│  ┌────────────┐  ┌───────────┐  │
│  │ Deployment │  │  Service   │  │
│  │ (3 replicas)◄─► (LoadBal.) │  │
│  └────────────┘  └─────┬─────┘  │
│                        │         │
│  ┌─────────────────────▼──────┐ │
│  │     Nginx Reverse Proxy    │ │
│  └────────────────────────────┘ │
└─────────────────────────────────┘
```

## 📋 What's Included

- **app/** — Simple Node.js HTTP server
- **Dockerfile** — Multi-stage build for the app
- **docker-compose.yml** — Local development with app + nginx
- **k8s/** — Kubernetes Deployment and Service manifests
- **nginx/** — Reverse proxy configuration

## 🚀 Getting Started

### Option 1: Docker Compose (Local)

```bash
docker compose up --build
```

Visit `http://localhost` to see the app served through nginx.

### Option 2: Standalone Docker

```bash
# Build the image
docker build -t k8s-playground ./app

# Run it
docker run -p 3000:3000 k8s-playground
```

Visit `http://localhost:3000`.

### Option 3: Kubernetes

```bash
# Apply manifests
kubectl apply -f k8s/

# Check pods
kubectl get pods

# Get service URL
kubectl get svc k8s-playground
```

### Cleanup

```bash
# Docker Compose
docker compose down

# Kubernetes
kubectl delete -f k8s/
```

## 📁 Project Structure

```
docker-k8s-playground/
├── app/
│   ├── server.js        # Node.js HTTP server
│   ├── package.json     # Dependencies
│   └── Dockerfile       # Container image definition
├── nginx/
│   └── default.conf     # Nginx reverse proxy config
├── k8s/
│   ├── deployment.yaml  # K8s Deployment (3 replicas)
│   └── service.yaml     # K8s Service (LoadBalancer)
├── docker-compose.yml   # Local multi-container setup
└── README.md
```

## 🎯 Learning Objectives

- Writing a Dockerfile from scratch
- Multi-container orchestration with Docker Compose
- Kubernetes Deployments, Services, and replica scaling
- Nginx as a reverse proxy in front of an app
- Health checks and resource limits

## 📄 License

[Apache License 2.0](LICENSE)

## 🙋 Author

**Mohammed Zaid Nadaf** — CS Engineering Student · Aspiring Cloud Engineer
