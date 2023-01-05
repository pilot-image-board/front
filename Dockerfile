FROM node:lts-alpine

RUN npm install -g http-server

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "http-server", "dist" ]
