FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache udev ttf-freefont chromium

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "start" ]
