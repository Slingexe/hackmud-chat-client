FROM node:20-alpine AS builder
WORKDIR /bot
COPY package*.json ./
RUN npm install --omit=dev

FROM node:alpine
WORKDIR /bot
COPY --from=builder /bot/node_modules ./node_modules
COPY . .
RUN echo {} >> config.json
RUN echo {} >> channelMappings.json


CMD ["node", "index.js"]