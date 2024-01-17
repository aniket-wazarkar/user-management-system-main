FROM node:17.3.0

WORKDIR /application

COPY package*.json ./

COPY . /application

RUN npm install


EXPOSE 3000

CMD [ "node", "app.js" ]