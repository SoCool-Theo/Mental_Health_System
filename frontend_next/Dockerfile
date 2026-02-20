# Node version
FROM node:22-alpine

# Create a folder inside the container for your code
WORKDIR /app

# Copy ONLY the package files first (makes building much faster)
COPY package.json package-lock.json* ./

# Install all Next.js dependencies
RUN npm install

# Copy the rest of your Next.js code
COPY . .

# Open the port Next.js uses
EXPOSE 3000

# Command to start the Next.js development server
CMD ["npm", "run", "dev"]