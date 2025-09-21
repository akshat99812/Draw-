# STAGE 1: Build the Next.js Frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Declare the build argument that we will pass in
ARG NEXT_PUBLIC_BACKEND_URL
# Set it as an environment variable so the build process can access it
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

# Copy package.json and package-lock.json to leverage Docker layer caching
COPY package*.json ./
RUN npm install

# Copy the rest of your frontend source code
COPY . .

# Build the Next.js application for production
# The build process will now use the NEXT_PUBLIC_BACKEND_URL env var
RUN npm run build

# STAGE 2: Production Image
FROM node:20-alpine AS production

WORKDIR /app

# Also set the environment variable in the final image
# This is useful for any server-side rendering parts of Next.js
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built assets from the builder stage
COPY --from=builder --chown=appuser:appgroup /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/node_modules ./node_modules

USER appuser

EXPOSE 3000

# The default start command for a Next.js app
CMD ["npm", "start"]



