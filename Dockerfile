FROM node:18-bullseye-slim as build
ENV USER=node
ENV HOME=/home/node
USER node
WORKDIR $HOME/learn

ADD --chown=$USER:$USER . .

RUN yarn workspaces focus app
RUN yarn run --top-level build


FROM node:18-bullseye-slim as prod
ENV USER=node
ENV HOME=/home/node
USER node
WORKDIR $HOME/learn

COPY --from=build /home/node/ /home/node/
