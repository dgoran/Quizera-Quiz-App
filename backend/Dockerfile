FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema first for better caching
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy rest of the application
COPY . .

# Expose the port
EXPOSE 3000

# Start command - will run migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
