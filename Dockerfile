FROM node:8.10

ENV PORT_=3000 \
    MONGO_ATLAS_URL="mongodb://mongo:27017/mongo-test" \
    UPLOADS_DIR=./uploads/

EXPOSE 3000

WORKDIR /server

COPY . .

RUN npm install

CMD ["npm", "run", "dev"]