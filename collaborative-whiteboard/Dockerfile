FROM node:latest

RUN mkdir /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY ./public /app/public
COPY ./src /app/src
COPY ./tsconfig.json .
COPY ./vite.config.ts .
COPY ./index.html .
COPY ./tsconfig.app.json .
COPY ./tsconfig.node.json .
EXPOSE 5173
CMD ["npm", "run", "dev"]
