FROM node:10
WORKDIR /Users/derekgrabhorn/Dev/mass-athletic
COPY . ./
RUN npm i && npm i ts-node -g

EXPOSE 4200
EXPOSE 3000

CMD ts-node ./server.ts