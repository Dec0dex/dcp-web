##################
# BUILD BASE IMAGE
##################
FROM node:20-alpine AS base

# Install and use pnpm
RUN npm install -g pnpm
RUN npm install -g @angular/cli

#############################
# BUILD FOR LOCAL DEVELOPMENT
#############################
FROM base AS development
WORKDIR /app
RUN chown -R node:node /app

COPY --chown=node:node package*.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies)
RUN pnpm install

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

#####################
# BUILD BUILDER IMAGE
#####################
FROM base AS builder
WORKDIR /app

COPY --chown=node:node package*.json pnpm-lock.yaml ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node --from=development /app/src ./src
COPY --chown=node:node --from=development /app/tsconfig.json ./tsconfig.json
COPY --chown=node:node --from=development /app/tsconfig.app.json ./tsconfig.app.json
COPY --chown=node:node --from=development /app/angular.json ./angular.json

# Build production
RUN pnpm install
RUN pnpm build:prod

# Removes unnecessary packages adn re-install only production dependencies
RUN pnpm prune --prod
RUN pnpm install --prod

USER node

######################
# BUILD FOR PRODUCTION
######################
FROM nginx:alpine

COPY --from=builder /app/dist/dcp-web/ /usr/share/nginx/html