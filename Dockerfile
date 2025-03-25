ARG NODE_TAG=18.14-alpine3.17
FROM node:${NODE_TAG}
WORKDIR /var/www
COPY package*.json .
COPY server/package*.json server/
RUN npm ci
COPY . .
EXPOSE 5001
CMD ["npm","-w","server","run","start"]