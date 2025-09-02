# Use official Node image based on Ubuntu
FROM node:20-bullseye

# Install git
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /home/collegegram/FrontEnd

# Clone the project from the specified repository
RUN git clone git@hamgit.ir:rc-dev-1404/groot/collegegram.git .

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Expose the port the app runs on
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev"]


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