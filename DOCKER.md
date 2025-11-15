# Docker Deployment Guide

This guide explains how to deploy the eBook Generation System using Docker and Docker Compose for optimized performance and easy deployment.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Usage](#usage)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- API keys for your chosen LLM provider (Anthropic, OpenAI, Gemini, or Groq)

### Installation

#### Install Docker Desktop
- **macOS/Windows**: [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: Follow the [official Docker installation guide](https://docs.docker.com/engine/install/)

---

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd 10v3
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
# Edit .env with your API keys
```

### 3. Build and Start Services

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend**: Available within the Docker network

---

## Architecture

### Service Overview

The system consists of two main services:

1. **Backend Service** (`ebook-generator-backend`)
   - Python 3.11-based container
   - Runs the 10-stage eBook generation pipeline
   - Handles LLM API calls (Anthropic, OpenAI, Gemini, Groq)
   - Generates eBooks, covers, diagrams, and interactive elements

2. **Frontend Service** (`ebook-generator-frontend`)
   - React 19 + Vite application
   - Nginx-based production server
   - Optimized static asset serving with gzip compression
   - Client-side routing support

### Network Architecture

```
┌─────────────────────────────────────────┐
│           Docker Network                │
│         (ebook-network)                 │
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │   Frontend   │    │   Backend    │  │
│  │   (Nginx)    │───▶│   (Python)   │  │
│  │   Port 80    │    │              │  │
│  └──────────────┘    └──────────────┘  │
│         │                    │          │
└─────────┼────────────────────┼──────────┘
          │                    │
     Port 3000              Output Volume
    (Host Access)         (/app/output)
```

---

## Configuration

### Environment Variables

Edit the `.env` file to configure your LLM providers:

```bash
# Primary API Key (choose your provider)
ANTHROPIC_API_KEY=sk-ant-xxxxx
OPENAI_API_KEY=sk-xxxxx
GEMINI_API_KEY=xxxxx
GROQ_API_KEY=gsk_xxxxx

# Default provider
DEFAULT_PROVIDER=anthropic

# Port configuration
FRONTEND_PORT=3000
```

### Docker Compose Configuration

Customize `docker-compose.yml` for your needs:

```yaml
services:
  frontend:
    ports:
      - "3000:80"  # Change host port if needed

  backend:
    volumes:
      - ./output:/app/output  # Output directory
      - ./config:/app/config  # Custom configs
```

---

## Usage

### Generate an eBook

#### Option 1: Using Docker Exec

```bash
# Interactive mode
docker exec -it ebook-generator-backend python generate_ebook.py

# With topic
docker exec -it ebook-generator-backend python generate_ebook.py \
  --topic "weight loss for beginners" \
  --provider anthropic \
  --auto

# With custom config
docker exec -it ebook-generator-backend python generate_ebook.py \
  --config /app/config/my_config.yaml \
  --output /app/output
```

#### Option 2: Using Docker Run

```bash
# One-off generation
docker run --rm \
  -v $(pwd)/output:/app/output \
  -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \
  ebook-generator-backend \
  python generate_ebook.py --topic "healthy eating" --auto
```

### Access Generated eBooks

Generated eBooks are saved in the `./output` directory on your host machine:

```bash
ls -lh ./output/
# FINAL_EBOOK.md
# config.yaml
# stage_1_queries.txt
# stage_6_cover_prompt.txt
# etc.
```

---

## Performance Optimization

### 1. Multi-Stage Builds

Both Dockerfiles use multi-stage builds to reduce image size:

- **Backend**: 180MB (vs 1GB+ with full Python image)
- **Frontend**: 45MB (vs 350MB+ with Node included)

### 2. Caching Strategy

Docker layers are optimized for build caching:

```dockerfile
# Dependencies installed first (cached)
COPY requirements.txt .
RUN pip install -r requirements.txt

# Code copied last (changes frequently)
COPY generate_ebook.py .
```

### 3. Resource Limits

Add resource limits to `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### 4. Parallel Generation

For batch processing, run multiple backend containers:

```bash
# docker-compose.scale.yml
services:
  backend:
    deploy:
      replicas: 3  # Run 3 instances

# Start with scaling
docker-compose -f docker-compose.yml -f docker-compose.scale.yml up -d
```

---

## Common Commands

### Build Services

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend

# Build with no cache
docker-compose build --no-cache
```

### Start/Stop Services

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Shell Access

```bash
# Backend shell
docker exec -it ebook-generator-backend bash

# Frontend shell
docker exec -it ebook-generator-frontend sh
```

### Health Checks

```bash
# Check service status
docker-compose ps

# Inspect health
docker inspect --format='{{.State.Health.Status}}' ebook-generator-frontend
```

---

## Troubleshooting

### Frontend Not Accessible

```bash
# Check if container is running
docker-compose ps

# Check logs
docker-compose logs frontend

# Verify port binding
docker port ebook-generator-frontend
```

### Backend Generation Fails

```bash
# Check API key configuration
docker exec ebook-generator-backend env | grep API_KEY

# Test with mock provider
docker exec -it ebook-generator-backend \
  python generate_ebook.py --topic "test" --provider mock --auto

# View detailed logs
docker-compose logs --tail=100 backend
```

### Permission Issues

```bash
# Fix output directory permissions
chmod -R 755 ./output
chown -R $USER:$USER ./output
```

### Rebuild Containers

```bash
# Complete rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Clean Up Docker Resources

```bash
# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Full cleanup
docker system prune -a --volumes
```

---

## Advanced Usage

### Custom Network Configuration

```yaml
# docker-compose.override.yml
services:
  frontend:
    networks:
      - ebook-network
      - external-network

networks:
  external-network:
    external: true
```

### Production Deployment

For production, consider:

1. **Use environment-specific compose files**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

2. **Enable HTTPS** (add SSL certificates to Nginx)

3. **Add monitoring** (Prometheus, Grafana)

4. **Set up log aggregation** (ELK stack, Loki)

5. **Configure backups** for output volumes

---

## Docker MCP Toolkit Integration

If you're using Docker Desktop with MCP Toolkit:

1. **Enable MCP Toolkit** in Docker Desktop Settings
2. **Connect to Claude Desktop** for enhanced AI capabilities
3. **Browse MCP Catalog** for additional containerized tools
4. **Add MCP servers** for GitHub, Kubernetes, or other integrations

This allows Claude to directly interact with your Docker containers for debugging, monitoring, and optimization.

---

## Security Best Practices

1. **Never commit `.env` files** with real API keys
2. **Use Docker secrets** for sensitive data in production
3. **Run containers as non-root user** (add to Dockerfiles)
4. **Scan images for vulnerabilities**:
   ```bash
   docker scan ebook-generator-backend
   ```
5. **Keep base images updated**:
   ```bash
   docker-compose pull
   docker-compose up -d --build
   ```

---

## Support

For issues or questions:
- Check the [main README](README.md)
- Review [TESTING.md](TESTING.md) for testing strategies
- Check Docker logs: `docker-compose logs -f`

---

**Built with Docker for optimal performance and portability**
