FROM node:16.13.1-alpine
WORKDIR /chuoicuahangvai-be
COPY . .
RUN yarn install
RUN yarn build NODE_ENV=production

CMD ["yarn", "start", "NODE_ENV=production"]
