FROM node:18-alpine

WORKDIR /app

COPY . .

CMD [ "yarn", "start" ]

EXPOSE 3000