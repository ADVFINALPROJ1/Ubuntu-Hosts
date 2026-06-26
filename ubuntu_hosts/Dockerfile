# Stage 1: Build the client
FROM oven/bun:1 AS client-builder
WORKDIR /app/client
COPY client/package.json client/bun.lock* ./
RUN bun install
COPY client/ .
RUN bun run build

# Stage 2: Run the server
FROM oven/bun:1
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install
COPY server/ ./server/
COPY drizzle.config.ts ./
COPY --from=client-builder /app/client/dist ./client/dist

EXPOSE 3000
CMD ["bun", "run", "server/index.ts"]