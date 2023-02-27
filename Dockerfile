FROM node:16.13.0

LABEL version="1.0"
LABEL description="Messenger app"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $PORT
CMD npm start