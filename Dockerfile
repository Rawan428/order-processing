# Use the official Node.js 18 image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Compile TypeScript into JavaScript
RUN npm run build

# Expose the application port
EXPOSE 3000

# Default command to run the application
CMD ["node", "dist/index.js"]
