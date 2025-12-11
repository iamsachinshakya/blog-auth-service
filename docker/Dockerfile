# --------------------------
# 1. Builder Stage
# --------------------------
FROM node:24-alpine AS builder
WORKDIR /app

# Enable Corepack and activate pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only dependency files first (best caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies (all, dev + prod)
RUN pnpm install

# Copy TypeScript config & source code
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript → JavaScript
RUN pnpm build


# --------------------------
# 2. Production Stage (Lightweight)
# --------------------------
FROM node:24-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Enable Corepack and activate pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only dependency files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod

# Copy built output from builder
COPY --from=builder /app/dist ./dist

# Expose API port
EXPOSE 5000

# Start the API
CMD ["node", "dist/server.js"]
