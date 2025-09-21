# STAGE 1: Production Server Build
FROM node:20-alpine AS production

# Install OpenSSL, which is a dependency for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Provide a dummy DATABASE_URL at build time for Prisma to generate the client
ARG DATABASE_URL="postgresql://user:password@host:port/db"

# Copy package.json and package-lock.json for the server
COPY package*.json ./

# Install all server dependencies for the build
RUN npm install

# Copy the prisma schema file
COPY prisma ./prisma/

# Generate the Prisma client
RUN npx prisma generate

# Copy the rest of the server source code
COPY . .

# Build the TypeScript server code into JavaScript
RUN npm run build

# Remove development dependencies from the final image
RUN npm prune --production

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3001

# The command to run migrations and then start your Express server when the container launches
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
