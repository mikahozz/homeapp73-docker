FROM debian:buster

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y curl && apt-get install -y chromium
RUN curl -fsSL https://deb.nodesource.com/setup_15.x | bash -
RUN apt-get install -y nodejs

# Install puppeteer so it's available in the container.
RUN npm i puppeteer && npm install dotenv
RUN mkdir data
COPY . .

EXPOSE 80

CMD ["node", "refreshbookings.js"]
