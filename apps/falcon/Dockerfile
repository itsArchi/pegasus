FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10 --activate

# ---- deps ----
FROM base AS deps
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/falcon/package.json ./apps/falcon/
RUN pnpm install --frozen-lockfile --filter falcon...

# ---- builder ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/falcon/node_modules ./apps/falcon/node_modules
COPY apps/falcon ./apps/falcon
COPY pnpm-workspace.yaml package.json ./

ARG NEXT_PUBLIC_PHOENIX_URL
ENV NEXT_PUBLIC_PHOENIX_URL=$NEXT_PUBLIC_PHOENIX_URL

RUN pnpm --filter falcon build

# ---- runner ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/falcon/.next/standalone ./
COPY --from=builder /app/apps/falcon/.next/static ./apps/falcon/.next/static
COPY --from=builder /app/apps/falcon/public ./apps/falcon/public

EXPOSE 3000
ENV PORT=3000
CMD ["node", "apps/falcon/server.js"]
