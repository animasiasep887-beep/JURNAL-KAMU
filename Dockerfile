FROM node:20-alpine

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install all dependencies (production & build dependencies)
RUN npm install --include=dev

# Copy entire application source
COPY . .

# Build Vite frontend bundle
RUN npm run build

# Expose HTTP port
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Start production server with Telegram Bot
CMD ["node", "server/prod.cjs"]
