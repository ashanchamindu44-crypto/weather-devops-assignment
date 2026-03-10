# Use official Node.js image as base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (better caching)
COPY package.json .

# Install dependencies
RUN npm install

# Copy remaining project files
COPY . .

# Expose port 3000
EXPOSE 3000

# Start application
CMD ["npm", "start"]