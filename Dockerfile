FROM node:lts-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

ENV VUE_APP_NODE_ENV=production

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.23.3-alpine AS production

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

RUN chmod a+r /usr/share/nginx/html -R

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
