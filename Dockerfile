FROM node:16
WORKDIR /usr/src/clean-node-api
COPY ./package.json .
RUN yarn install --only=prod