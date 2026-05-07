FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10 --activate

# ---- deps ----
FROM base AS deps
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/dolphin/package.json ./apps/dolphin/
RUN pnpm install --frozen-lockfile --filter dolphin...

# ---- builder ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/dolphin/node_modules ./apps/dolphin/node_modules
COPY apps/dolphin ./apps/dolphin
COPY pnpm-workspace.yaml package.json ./

ARG NEXT_PUBLIC_PHOENIX_URL
ENV NEXT_PUBLIC_PHOENIX_URL=$NEXT_PUBLIC_PHOENIX_URL

RUN pnpm --filter dolphin build

# ---- runner ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/dolphin/.next/standalone ./
COPY --from=builder /app/apps/dolphin/.next/static ./apps/dolphin/.next/static
COPY --from=builder /app/apps/dolphin/public ./apps/dolphin/public

EXPOSE 3001
ENV PORT=3001
CMD ["node", "apps/dolphin/server.js"]
