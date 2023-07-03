# Declare the base image
FROM node:lts-alpine3.14
# Build step
# 1. copy package.json and package-lock.json to /app dir
RUN mkdir /app
COPY package*.json /app
# 2. Change working directory to newly created app dir
WORKDIR /app
# 3 . Install dependencies
RUN npm i --force
# 4. Copy the source code to /app dir
COPY . .
# 5. Expose port 3000 on the container
EXPOSE 8000

ENV FILE_SERVER_HOST "http://localhost:3000"
ENV API_HOST "http://localhost:5199"
# 6. Run the app
CMD ["npm", "run", "start"]