FROM node:8.10

ENV PORT_=3000 \
    MONGO_ATLAS_URL=mongodb+srv://sukesh:batman1@ng-cluster-0uosh.mongodb.net/userdb?retryWrites=true \
    UPLOADS_DIR=./uploads/

EXPOSE 3000

WORKDIR /server

COPY . .

RUN npm install

CMD ["npm", "run", "dev"]