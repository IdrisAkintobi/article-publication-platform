# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install dependencies in a separate layer for caching
FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build the application
FROM base AS build
COPY --from=install /usr/src/app/node_modules node_modules
COPY ./src ./src
COPY ./build.ts ./
COPY ./package.json .
RUN bun run build

# Create final image with only necessary files
FROM base AS release
COPY --from=install /usr/src/app/node_modules node_modules
COPY --from=build /usr/src/app/dist dist
COPY package.json .

# Set user and expose port
USER bun
EXPOSE 3000/tcp

# Run the application
CMD ["bun", "dist/index.js"]
