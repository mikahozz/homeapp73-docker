FROM debian:buster

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y chromium nodejs sqlite

COPY package*.json ./
RUN npm install

RUN mkdir data

COPY . .

EXPOSE 80

CMD ["node", "app.js"]
