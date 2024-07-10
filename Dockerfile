FROM node:20.9.0 AS build
RUN apt-get update && \
    apt-get install -y --no-install-recommends dumb-init
USER node
WORKDIR /usr/src/app
COPY --chown=node:node . /usr/src/app/
RUN npm ci

FROM node:20.9.0-bullseye-slim
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
USER node
ENV TZ Asia/Singapore
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app /usr/src/app
WORKDIR /usr/src/app
CMD ["dumb-init", "npm", "start"]