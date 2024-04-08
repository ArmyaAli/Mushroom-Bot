######################################
######################################
# Author: Ali Umar
# Date: 2024-04-08
# Version: 1.0
# Description: Docker image for Mushroom-Bot music player node application
######################################
######################################

# Requires the following environment variables:
# DISCORD_CLIENT_ID=
# DISCORD_CLIENT_SECRET=
# DISCORD_BOT_TOKEN=
  

# Use default node template
FROM node:20.11.0

# Docker Image data
LABEL maintainer="ali.umar.work@gmail.com"
LABEL version="1.0"
LABEL description="This is a Docker image for Ali Umar's Discord Bot. Mushroom Bot."

# Move over dependency files
COPY package.json package-lock.json tsconfig.json .
COPY src ./src

# Install deps
RUN npm install 

# Build js files
RUN npm run build 

# Create deployment dir
WORKDIR /bot

# Copy over deps
COPY node_modules /bot/node_modules

# Copy over built commands
COPY dist/commands /bot/commands

# Copy over everything else
COPY dist/* .

# Clean up
RUN rm -rf /dist /node_modules /tsconfig.json /package.json /package-lock.json

# Run main.js via Node runtime
CMD [ "node", "main.js"]
