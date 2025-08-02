# Backend Dockerfile for Ha Linh Vietnamese Astrology Application

# Development stage
FROM node:18-alpine AS development

# Set working directory
WORKDIR /app

# Install dependencies for building native modules
RUN apk add --no-cache python3 make g++

# Set Vietnamese timezone
RUN apk add --no-cache tzdata
ENV TZ=Asia/Ho_Chi_Minh

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=development

# Copy TypeScript configuration
COPY tsconfig.json ./

# Copy source code
COPY src/ ./src/
COPY shared/ ./shared/

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 3001

# Start development server with hot reload
CMD ["npm", "run", "dev"]

# Production build stage
FROM node:18-alpine AS build

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/
COPY shared/ ./shared/

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Set Vietnamese timezone
RUN apk add --no-cache tzdata
ENV TZ=Asia/Ho_Chi_Minh

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S halinh -u 1001

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from build stage
COPY --from=build --chown=halinh:nodejs /app/dist ./dist

# Create necessary directories
RUN mkdir -p logs uploads && \
    chown -R halinh:nodejs logs uploads

# Switch to app user
USER halinh

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "dist/server.js"]