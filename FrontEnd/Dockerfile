# Use official Ubuntu image
FROM ubuntu:22.04

# Install curl, git, and Node.js
RUN apt-get update && \
    apt-get install -y curl git && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /home/collegegram/FrontEnd

# Clone the project from the specified repository
RUN git clone git@hamgit.ir:rc-dev-1404/groot/collegegram.git .

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN pnpm run build

# Expose the port the app runs on
EXPOSE 5173

# Start the application
CMD ["pnpm", "run", "dev"]


# Install and Run Nginx on server:
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Production stage
# FROM nginx:stable

# # Remove default Nginx static assets
# RUN rm -rf /usr/share/nginx/html/*

# # Copy build output to Nginx html directory
# COPY --from=build /app/build /usr/share/nginx/html

# # Copy custom Nginx config if you have one
# # COPY nginx.conf /etc/nginx/nginx.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]