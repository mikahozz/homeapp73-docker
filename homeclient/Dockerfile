# Build stage
FROM node:20-bookworm-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci
# RUN npm install -D @swc/cli @swc/core

COPY . .
RUN npm run build

# Production stage
FROM node:20-bookworm-slim AS production

WORKDIR /app

# Install Bun using the official installer
RUN apt-get update && apt-get install -y curl unzip
RUN curl -fsSL https://bun.sh/install | bash
# Add Bun to PATH
ENV PATH="/root/.bun/bin:${PATH}"

COPY --from=build /app/dist ./dist
ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "dist/index.html"]
