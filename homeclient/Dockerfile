FROM node:14.14.0-alpine3.10 AS BUILD_IMAGE
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ./
RUN npm install -g serve
COPY . .
EXPOSE 3000
RUN npm run build
CMD ["serve", "-s", "build"]
