# Install dependencies only when needed
FROM --platform=linux/amd64 node:18-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build the app
FROM --platform=linux/amd64 node:18-alpine AS builder
WORKDIR /app
# Install pnpm in the builder stage
RUN npm install -g pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm exec prisma generate
ARG NEXT_PUBLIC_BETTER_AUTH_URL
ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL
ARG DATABASE_URL
ENV SKIP_ENV_VALIDATION=1
RUN pnpm run build

# Production image
FROM --platform=linux/amd64 node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Copy prisma directory including migrations folder
COPY --from=builder /app/prisma ./prisma
# Copy the entire node_modules to ensure all Prisma dependencies are available
COPY --from=builder /app/node_modules ./node_modules
# Copy startup script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh
EXPOSE 3000
# Use the startup script
CMD ["./docker-entrypoint.sh"]