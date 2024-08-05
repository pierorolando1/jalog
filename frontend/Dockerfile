
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Expose the port Vite uses by default
EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]