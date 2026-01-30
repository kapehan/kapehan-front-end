# ---------- Builder ----------
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install 

COPY . .
RUN pnpm build

# ---------- Runner ----------
FROM node:20-slim

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# optional, only if you have it:
COPY --from=builder /app/next.config.* ./

EXPOSE 3000
CMD ["pnpm", "start"]
