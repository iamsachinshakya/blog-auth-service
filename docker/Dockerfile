# --------------------------
# 1. Builder Stage
# --------------------------
FROM node:24-alpine AS builder
WORKDIR /app

# Install tools required for native npm deps
# RUN apk add --no-cache python3 make g++

# Copy dependency files
COPY package.json package-lock.json ./

# Install all dependencies (including dev deps)
RUN npm ci

# Copy TypeScript config & app source
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript → JavaScript
RUN npm run build


# --------------------------
# 2. Production Runtime
# --------------------------
FROM node:24-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Copy package files again
COPY package.json package-lock.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev

# Copy compiled build files
COPY --from=builder /app/dist ./dist

# Expose API port
EXPOSE 5000

# Start the API
CMD ["node", "dist/server.js"]
