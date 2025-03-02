# Build stage
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci
RUN npm install -D @swc/cli @swc/core

COPY . .
RUN npm run build

# Production stage
FROM oven/bun:1.2.4 AS production

WORKDIR /app
COPY --from=build /app/dist ./dist
ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "dist/index.html"]
