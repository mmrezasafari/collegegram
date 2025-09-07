FROM node:20-alpine AS builder

WORKDIR /usr/src/app/BackEnd

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


FROM node:20-alpine AS run

WORKDIR /usr/src/app/BackEnd

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=builder /usr/src/app/BackEnd/dist ./dist

EXPOSE 3000

CMD ["node","./dist/src/main.js"]