# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port (Render requires this)
EXPOSE $PORT

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD ["sh", "-c", "npm run start:prod"]
