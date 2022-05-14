FROM node:16.13.1-alpine
ENV DATABASE_HOST=0.0.0.0
ENV DATABASE_PORT=5432
ENV DATABASE_NAME=chuoicuahangvai-db
ENV DATABASE_USERNAME=postgres
ENV DATABASE_PASSWORD=postgres
WORKDIR /chuoicuahangvai-be
COPY . .
RUN yarn install
CMD ["yarn", "strapi", "develop"]
