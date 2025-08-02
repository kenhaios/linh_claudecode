# Frontend Dockerfile for Ha Linh Vietnamese Astrology Application

# Development stage
FROM node:18-alpine AS development

# Set working directory
WORKDIR /app

# Set Vietnamese timezone
RUN apk add --no-cache tzdata
ENV TZ=Asia/Ho_Chi_Minh

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy configuration files
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY index.html ./

# Copy source code
COPY src/ ./src/
COPY public/ ./public/
COPY shared/ ./shared/

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Set Vietnamese timezone
RUN apk add --no-cache tzdata
ENV TZ=Asia/Ho_Chi_Minh

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Build arguments for Vietnamese environment
ARG VITE_API_URL=http://localhost:3001
ARG VITE_SOCKET_URL=http://localhost:3001
ARG VITE_DEFAULT_LANGUAGE=vi
ARG VITE_DEFAULT_TIMEZONE=Asia/Ho_Chi_Minh

# Set build environment variables
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
ENV VITE_DEFAULT_LANGUAGE=$VITE_DEFAULT_LANGUAGE
ENV VITE_DEFAULT_TIMEZONE=$VITE_DEFAULT_TIMEZONE

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Set Vietnamese timezone
RUN apk add --no-cache tzdata
ENV TZ=Asia/Ho_Chi_Minh

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy Vietnamese-specific nginx configuration
COPY docker/nginx/vietnamese.conf /etc/nginx/conf.d/vietnamese.conf

# Create nginx user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]