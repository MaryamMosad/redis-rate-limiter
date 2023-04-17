FROM node:18.15.0-alpine as build-stage

WORKDIR /app/

COPY package*.json ./

RUN npm i --omit=dev

COPY . .


CMD [ "npm", "run" , "start"]
