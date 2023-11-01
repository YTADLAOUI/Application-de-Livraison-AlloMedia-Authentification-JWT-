# Dockerfile for React client

FROM node:18.16-alpine

# Working directory be app
WORKDIR /app

# Install Dependencies
COPY package.json .

###  Installing dependencies
RUN npm install

# copy local files to app folder
COPY . .

# Exports
EXPOSE 8000

CMD ["npm","run","dev:server"]