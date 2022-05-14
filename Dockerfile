FROM node:16.13.1-alpine
WORKDIR /chuoicuahangvai-be
COPY . .
RUN yarn install
RUN yarn build NODE_ENV=production
RUN npm install -g pm2
CMD ["pm2-runtime", "start", "ecosystems.config.js"]

