# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose the port that service2 listens on
EXPOSE 3001

# Command to run your app
CMD ["yarn", "dev"]
