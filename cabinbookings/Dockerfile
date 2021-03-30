FROM debian:buster

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y curl && apt-get install -y chromium
RUN curl -fsSL https://deb.nodesource.com/setup_15.x | bash -
RUN apt-get install -y nodejs

COPY package*.json ./
RUN npm install

RUN mkdir data

COPY . .

EXPOSE 80

CMD ["node", "refreshbookings.js"]
