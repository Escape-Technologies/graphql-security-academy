FROM node:23-bullseye-slim AS build
ENV USER=node
ENV HOME=/home/node
USER node
WORKDIR $HOME/academy

ADD --chown=$USER:$USER . .

RUN YARN_CHECKSUM_BEHAVIOR=ignore yarn workspaces focus app && yarn build
CMD [ "sh", "-c", "node packages/app/build/index.js" ]
