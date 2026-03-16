FROM node:16-alpine as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-alpine As production
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

# Копируем результат сборки из build-стадии
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]