FROM node:21-alpine3.17

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 8080

CMD ["node", "app.js"]