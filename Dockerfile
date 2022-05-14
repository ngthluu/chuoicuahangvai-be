FROM node:16.13.1-alpine
WORKDIR /chuoicuahangvai-be
COPY . .
RUN yarn install
CMD ["yarn", "strapi", "develop"]
