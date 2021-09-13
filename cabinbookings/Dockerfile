FROM node:16.9.0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install -g nodemon
RUN npm install

COPY . .

EXPOSE 3011

CMD ["nodemon", "app.js"]
