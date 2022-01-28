FROM node:16.9.0 AS BUILD_IMAGE

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

# install dependencies
RUN npm ci

COPY . .

# lint & test
# RUN yarn lint & yarn test

# build application
# RUN yarn build

FROM node:12-alpine

WORKDIR /usr/src/app

# copy from build image
COPY --from=BUILD_IMAGE /usr/src/app/ ./

EXPOSE 3013

CMD [ "node", "./index.js" ]