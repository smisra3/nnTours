# FROM ubuntu
FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5500
CMD [ "node", "server.js" ]

# docker build . -t <your username>/node-web-app
# docker run -p 45454:5500 <imageID>

