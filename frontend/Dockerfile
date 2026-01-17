FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_URI
ENV VITE_API_URI=$VITE_API_URI

RUN npm run build

