FROM node:12
WORKDIR /Users/derekgrabhorn/Dev/mass-athletic/ui
COPY . ./
RUN npm i -g @angular/cli && npm i
EXPOSE 4200
CMD ng serve --proxy-config proxy.json