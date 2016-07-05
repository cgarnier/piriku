FROM node:latest

RUN mkdir /piriku

COPY . /piriku

RUN npm install -g /piriku

WORKDIR /tmp

ENTRYPOINT ["/usr/local/lib/node_modules/piriku/bin/piriku"]
CMD ["-h"]