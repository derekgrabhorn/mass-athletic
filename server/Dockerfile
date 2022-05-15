FROM node:10
WORKDIR /Users/derekgrabhorn/Dev/mass-athletic/server
COPY . ./
RUN npm i && npm i ts-node -g
EXPOSE 3000

CMD ts-node ./server.ts