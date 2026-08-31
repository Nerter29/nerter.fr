# build part for tsc
FROM node:22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json tsconfig.json ./
RUN npm ci

COPY . .
RUN npx tsc

# run part for node
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --only=dev

COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["node", "build/server.js"]