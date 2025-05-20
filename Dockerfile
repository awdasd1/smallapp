# Stage 1: Build the application
FROM node:20-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Add verbose logging to build process
RUN echo "Building application..." && \
    # Build with more diagnostic information
    npm run build || { echo "Build failed - showing TypeScript issues"; exit 1; }

# Stage 2: Serve the application
FROM nginx:alpine

# Copy built files from stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
