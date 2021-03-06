FROM node:alpine

# Install needed packages.
RUN apk update && apk add -f \
    curl \
    nano \
    git \
    openssh-client

# TODO:
# Generate ssh keys and include them in the install:
# http://www.firedaemon.com/blog/passwordless-root-ssh-public-key-authentication-on-centos-6
RUN mkdir /root/.ssh
RUN chmod 700 /root/.ssh
COPY sshkeys /root/.ssh/
RUN chmod 600 /root/.ssh/*

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
#COPY package.json .
# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json ./

# Bundle app source
COPY app .

RUN npm install

EXPOSE 7777
CMD [ "npm", "start" ]