FROM mcr.microsoft.com/playwright:v1.32.3-jammy

# Create a directory for your application
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Playwright and other dependencies
RUN npm ci

# Define the command to run the Playwright tests
CMD ["npx", "playwright", "test"]