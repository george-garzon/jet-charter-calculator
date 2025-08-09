FROM node:20-bullseye

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy only to allow hot-reload via volume; this is a fallback if volume not mounted
COPY . .

EXPOSE 3000
