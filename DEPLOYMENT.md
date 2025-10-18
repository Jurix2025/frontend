# Jurix Frontend - Deployment Guide

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 1.29 or higher)
- OpenAI API Key

## Quick Start

### 1. Environment Setup

Copy the example environment file and configure your API key:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-proj-your-actual-api-key-here
```

### 2. Build and Run with Docker Compose

```bash
docker-compose up -d
```

This will:
- Build the Docker image
- Start the container
- Expose the application on port 3000

### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Manual Docker Commands

### Build the Docker image

```bash
docker build -t jurix-frontend:latest .
```

### Run the container

```bash
docker run -d \
  --name jurix-frontend \
  -p 3000:3000 \
  --env-file .env.local \
  jurix-frontend:latest
```

## Docker Commands Reference

### View logs

```bash
docker-compose logs -f jurix-frontend
```

### Stop the application

```bash
docker-compose down
```

### Restart the application

```bash
docker-compose restart
```

### Rebuild and restart

```bash
docker-compose up -d --build
```

### Check container status

```bash
docker-compose ps
```

## Production Deployment

### Using a Cloud Provider (AWS, GCP, Azure)

1. Push the Docker image to a container registry:

```bash
# Tag the image
docker tag jurix-frontend:latest your-registry/jurix-frontend:latest

# Push to registry
docker push your-registry/jurix-frontend:latest
```

2. Deploy using your cloud provider's container service (ECS, Cloud Run, Container Instances, etc.)

### Using a VPS/Server

1. Clone the repository on your server
2. Set up environment variables in `.env.local`
3. Run with docker-compose:

```bash
docker-compose up -d
```

4. (Optional) Set up a reverse proxy with Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key for content generation |
| `NODE_ENV` | No | Environment mode (default: production) |
| `NEXT_TELEMETRY_DISABLED` | No | Disable Next.js telemetry (default: 1) |

## Health Check

The application includes a health check endpoint. To verify the container is healthy:

```bash
docker inspect --format='{{.State.Health.Status}}' jurix-frontend
```

## Troubleshooting

### Container fails to start

1. Check logs:
```bash
docker-compose logs jurix-frontend
```

2. Verify environment variables are set correctly

3. Ensure port 3000 is not already in use:
```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

### OpenAI API not working

1. Verify your API key is correctly set in `.env.local`
2. Check the container has access to the environment variable:
```bash
docker exec jurix-frontend env | grep OPENAI
```

### Build fails

1. Clear Docker build cache:
```bash
docker builder prune
```

2. Rebuild from scratch:
```bash
docker-compose build --no-cache
```

## Security Notes

- Never commit `.env.local` to version control
- Keep your OpenAI API key secure
- Use HTTPS in production
- Consider implementing rate limiting for API endpoints
- Regularly update dependencies

## Performance Optimization

The Docker setup uses multi-stage builds to:
- Minimize image size
- Improve build times
- Separate build and runtime dependencies

The final image size is approximately 150-200 MB.

## Support

For issues or questions, please refer to the main README or contact the development team.
