FROM node:15.1

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y chromium

# Install puppeteer so it's available in the container.
RUN npm i puppeteer && npm install dotenv

COPY . .

EXPOSE 80

CMD ["node", "getbookings.js"]
