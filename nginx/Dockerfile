FROM nginx:stable-alpine

# Удаляем дефолтный конфиг и копируем свой
RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]