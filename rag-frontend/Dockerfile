FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build Vite app
RUN npm run build

# Install serve globally
RUN npm install -g serve

EXPOSE 3002

# Serve the built app
CMD ["serve", "-s", "dist", "-l", "3002"]
