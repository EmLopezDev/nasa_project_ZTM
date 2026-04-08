FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
COPY client/package*.json client/
COPY server/package*.json server/

RUN npm run install:client --omit=dev && \
    npm run install:server --omit=dev

COPY client/ client/
RUN npm run build --prefix client

COPY server/ server/

COPY --chown=node:node ./server/key.pem /app/server/key.pem
COPY --chown=node:node ./server/cert.pem /app/server/cert.pem

USER node

EXPOSE 8000

CMD ["npm", "start", "--prefix", "server"]
