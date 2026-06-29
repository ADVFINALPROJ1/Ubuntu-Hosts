FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS build
COPY package.json bun.lock ./
COPY client/package.json client/bun.lock ./client/
RUN bun install
WORKDIR /app/client
RUN bun install
WORKDIR /app
COPY . .

# Build-time env vars for Vite (baked into the JS bundle)
ARG APP_ENV=production
ARG VITE_PRODUCTION_API
ARG VITE_LOCAL_API

# Make them available as real env vars so Vite can read them during build
ENV APP_ENV=$APP_ENV
ENV VITE_PRODUCTION_API=$VITE_PRODUCTION_API
ENV VITE_LOCAL_API=$VITE_LOCAL_API

RUN bun run build

FROM oven/bun:1 AS release
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/client/dist ./client/dist
COPY package.json bun.lock ./
RUN bun install --production

# Runtime env vars (for the backend server process)
ENV APP_ENV=production

EXPOSE 3000
CMD ["bun", "run", "start"]