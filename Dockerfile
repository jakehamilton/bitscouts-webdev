FROM node

RUN mkdir -p /opt/app
ADD . /opt/app/

RUN cd /opt/app && npm install --production

WORKDIR /opt/app
CMD ["node", "index.js"]