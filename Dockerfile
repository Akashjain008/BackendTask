# FROM node:16-alpine AS base
# LABEL Planet Space Center Service
# WORKDIR /src
# COPY package*.json ./
# RUN npm i
# COPY . ./
# EXPOSE 8080
# CMD [ "node", "index.js" ]

FROM node:18-alpine

# ARG NODE_ENV 
ENV NODE_ENV development

WORKDIR /app
COPY package*.json ./
COPY . ./

RUN npm i
RUN npm run build
# RUN npm run migration
# RUN npm RUN seeds

CMD npm run migration && npm run seeds && npm run serve


EXPOSE 4000 
