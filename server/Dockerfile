FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN npm install -g pm2

RUN chmod +x start.sh

EXPOSE 5000

CMD ["sh", "./start.sh"]