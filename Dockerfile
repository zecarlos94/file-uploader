FROM node:20-alpine3.19

# Setup working directory
WORKDIR /usr/src/app

# Install
COPY package*.json ./
RUN npm install -ci --only=production

# Copy remaining files
COPY . ./

# Bundle
RUN NODE_ENV=production npm run build

# Start server
CMD NODE_ENV=production npm run serve
