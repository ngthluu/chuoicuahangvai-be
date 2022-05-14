FROM node:16.13.1-alpine
WORKDIR /chuoicuahangvai-be
COPY . .
RUN npm install
CMD ["npm", "start"]
