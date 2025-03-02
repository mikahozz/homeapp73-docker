# Build stage
FROM node:20-bookworm-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci
# RUN npm install -D @swc/cli @swc/core

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app
RUN npm install -g bun
COPY --from=build /app/dist ./dist
ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "dist/index.html"]
