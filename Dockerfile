FROM node:lts-buster AS builder
# Set working directory
WORKDIR /app
# Copy all files from current directory to working dir in image
COPY package*.json ./
RUN npm install --progress=verbose
COPY . .
RUN npm run build

# nginx state for serving content
FROM nginx:alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

COPY /nginx/default.conf /etc/nginx/conf.d/default.conf
# Remove default nginx static assets
# RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /app/dist .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]