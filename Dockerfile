FROM node:20.5.1-slim

RUN useradd -m -u 1001 node2
USER node2

WORKDIR /home/node2/app

CMD [ "tail", "-f", "/dev/null" ]