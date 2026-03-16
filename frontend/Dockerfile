# Этап 1: Сборка
FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Этап 2: Подготовка данных для Volume
FROM alpine:latest
WORKDIR /app
COPY --from=build /usr/src/app/dist ./dist

# Копируем файлы в Volume при старте и оставляем контейнер "висеть"
CMD sh -c "cp -rp /app/dist/. /var/www/html/ && echo 'Билд в томе' && sleep infinity"