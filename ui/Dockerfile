FROM node:12
WORKDIR /Users/derekgrabhorn/Dev/mass-athletic
COPY . ./
RUN npm i -g @angular/cli && npm i && ng serve --proxy-config proxy.json

CMD ng serve --proxy-config proxy.json