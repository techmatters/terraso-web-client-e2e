FROM mcr.microsoft.com/playwright:v1.32.3-jammy

# Create a directory for your application
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Playwright and other dependencies
RUN npm ci

# Copy your test files into the image
# COPY . .

# Set the working directory to the test directory (change this to your test directory)
# WORKDIR /app/tests

# Define the command to run the Playwright tests
CMD ["npx", "playwright", "test"]