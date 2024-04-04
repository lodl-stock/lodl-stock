FROM node:16.14.2
RUN npm install -g nodemon

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm i --silent

COPY . ./
