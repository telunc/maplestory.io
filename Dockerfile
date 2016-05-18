FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/lib
RUN mkdir -p /usr/src/app/cert
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY npm-shrinkwrap.json /usr/src/app/
RUN npm install --production

# Bundle app source
COPY lib /usr/src/app/lib/
COPY cert /usr/src/app/cert/

CMD [ "npm", "start" ]
