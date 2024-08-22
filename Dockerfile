FROM node:18.18

WORKDIR /app

COPY package*.json ./

RUN yarn install
COPY . .
RUN yarn run build

CMD [ "./bin/run", "start", "--config", "config/custom_deploy_config.json", "--overwrite-config" ]

  