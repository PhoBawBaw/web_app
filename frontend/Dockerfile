FROM node:21

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm install -g pnpm

WORKDIR /app

RUN pnpm add hls.js

EXPOSE 3000
