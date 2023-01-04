FROM node:16

WORKDIR /server
COPY package.json .
RUN npm install yarn
RUN yarn install
COPY . .
CMD yarn serve