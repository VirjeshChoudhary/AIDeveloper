FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_API_URI
ENV VITE_API_URI=$VITE_API_URI

RUN npm run build

FROM nginx:alpine

COPY build /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
