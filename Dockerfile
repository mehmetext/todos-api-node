FROM node:lts-slim

RUN apt-get update -y

RUN apt-get install -y openssl

WORKDIR /app

COPY . .

RUN npm install

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
