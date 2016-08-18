FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/lib
RUN mkdir -p /usr/src/app/cert
RUN mkdir -p /usr/src/less
RUN mkdir -p /usr/src/app/public
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --production

# Bundle app source
COPY less /usr/src/app/less
COPY lib /usr/src/app/lib/
COPY public /usr/src/app/public

CMD [ "npm", "start" ]
