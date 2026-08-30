FROM node:20-alpine AS builder # build part for tsc
WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm install --only=production

COPY . .
RUN npx tsc

FROM node:20-alpine AS runner # run part for node
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["node", "build/server.js"]