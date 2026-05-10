FROM node:18-alpine

WORKDIR /bazaar-api

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy source and config
COPY . .

# Run the TypeScript compiler
RUN npm run build

# Expose your port
EXPOSE 3000

# Run the COMPILED javascript, not the typescript
CMD [ "node", "dist/index.js" ]