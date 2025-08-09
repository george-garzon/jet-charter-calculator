# Stage 1: Build
FROM node:20-alpine as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
