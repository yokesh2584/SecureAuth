# Use an official Node.js image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package files separately for caching
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of your project files
COPY . .

# Build the TypeScript code
RUN yarn build

# Expose the port your server runs on (change if needed)
EXPOSE 5000

# Command to run your app
CMD ["node", "dist/index.js"]
