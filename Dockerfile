FROM bitnami/node:10 AS builder
WORKDIR /app
COPY package*.json /app/
RUN npm install --quiet
COPY . /app/
RUN npm run build

FROM nginx:stable

EXPOSE 80

COPY --from=builder /app/dist/ /var/www
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
