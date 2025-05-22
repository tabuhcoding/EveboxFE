# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only the package.json and install deps first (cache optimization)
COPY package.json ./

RUN npm install

# Copy toàn bộ code vào container
COPY . .

# Build Next.js (production)
RUN npm run build

# ---- Stage 2: Run Production ----
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy node_modules, .next, public, .env, next.config.ts, v.v...
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/src ./src

EXPOSE 3000

CMD ["npm", "start"]
