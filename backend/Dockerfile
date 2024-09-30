FROM node:latest

RUN mkdir ./app

WORKDIR /app

COPY package.json .

RUN npm install

COPY ./src/* ./src/

COPY ./tsconfig.json .

RUN npm run build

ENV SERVER_PORT=5000

EXPOSE 5000

CMD ["npm", "start"]
