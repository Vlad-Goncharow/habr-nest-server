FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client

COPY package*.json ./

RUN npm install

COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

COPY . .

CMD ["sh", "-c", "/wait-for-db.sh && npm run start:dev"]
