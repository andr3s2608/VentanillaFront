# stage 1
FROM node:14.7.0-alpine3.12 as node
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build:prod

# stage 2
FROM nginx:1.20.0-alpine
LABEL author="SOR"
COPY --from=node /app/build /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]
