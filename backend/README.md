# Instructors Elimu Backend - Docker Setup

## Prerequisites
- Docker
- Docker Compose

## Environment Variables
Create a `.env` file in the project root with the following variables:
```
MONGODB_URI=mongodb://mongodb:27017/instructors-elimu
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
FRONTEND_URL=http://localhost:3001
```

## Building and Running

### Development
```bash
# Build and start services
docker-compose up --build

# Stop services
docker-compose down
```

### Production
```bash
# Build production image
docker build -t instructors-elimu-backend .

# Run production container
docker run -p 3000:3000 \
  -e MONGODB_URI=mongodb://your_mongodb_host \
  -e JWT_SECRET=your_secret \
  instructors-elimu-backend
```

## Accessing the Application
- Backend: `http://localhost:3000`
- MongoDB: `mongodb://localhost:27017`

## Troubleshooting
- Ensure all environment variables are set
- Check Docker logs for any startup issues
- Verify network connectivity between services
