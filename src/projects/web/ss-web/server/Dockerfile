# build part for tsc
FROM node:20-alpine AS builder 
WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm ci

COPY . .
RUN npx tsc

# run part for node
FROM node:20-alpine AS runner 
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["node", "build/server.js"]