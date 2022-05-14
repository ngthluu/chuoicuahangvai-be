FROM node:16.13.1-alpine
WORKDIR /chuoicuahangvai-be
COPY . .
RUN yarn install
RUN NODE_ENV=production yarn build
RUN npm install -g pm2
CMD ["pm2-runtime", "start", "NODE_ENV=production", "yarn", "--interpreter", "bash", "--name", "chuoicuahangvai-be", "--", "start"]

