# Stage 1: Build stage
FROM node:20-alpine3.18 AS builder

WORKDIR /app

# Install OpenSSL 3.0 and other required dependencies
RUN apk add --no-cache openssl3 openssl3-dev

# Install pnpm
RUN npm i -g corepack && corepack enable && corepack prepare pnpm@latest --activate

# Copy pnpm specific files for better layer caching
COPY pnpm-lock.yaml ./
COPY package.json ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build TypeScript code
RUN pnpm prisma generate
RUN pnpm run build

# Prune dev dependencies
RUN pnpm prune --prod

# Stage 2: Production stage
FROM node:20-alpine3.18 AS runner

WORKDIR /app

# Install pnpm
RUN npm i -g corepack && corepack enable && corepack prepare pnpm@latest --activate

# Copy only necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

ENV NODE_ENV=production
ENV DD_ENV=production

EXPOSE 3000

CMD ["node", "dist/index.js"] 