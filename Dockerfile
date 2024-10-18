FROM node:23-bullseye-slim as build
ENV USER=node
ENV HOME=/home/node
USER node
WORKDIR $HOME/academy

ADD --chown=$USER:$USER . .

RUN yarn workspaces focus app && yarn run --top-level build
CMD [ "sh", "-c", "node packages/app/build/index.js" ]
