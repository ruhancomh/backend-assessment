FROM node:alpine

WORKDIR /usr/app

COPY app/package*.json ./
RUN npm install -f

COPY app/ .

EXPOSE 3000

CMD ["npm", "start"]    