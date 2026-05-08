FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10 --activate

# ---- deps ----
FROM base AS deps
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/phoenix/package.json ./apps/phoenix/
RUN pnpm install --frozen-lockfile --filter phoenix...

# ---- builder ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/phoenix/node_modules ./apps/phoenix/node_modules
COPY apps/phoenix ./apps/phoenix
COPY pnpm-workspace.yaml package.json ./
RUN pnpm --filter phoenix build

# ---- deploy ----
FROM base AS deploy
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/phoenix/package.json ./apps/phoenix/
COPY --from=builder /app/apps/phoenix/dist ./apps/phoenix/dist
RUN pnpm deploy --filter phoenix --prod --legacy /app/deploy

# ---- runner ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deploy /app/deploy ./

EXPOSE 3000
CMD ["node", "dist/main"]
