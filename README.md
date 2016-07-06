[![Build Status](https://travis-ci.org/cgarnier/piriku.svg?branch=master)](https://travis-ci.org/cgarnier/piriku)

# piriku
Tiny deployment cli based on git.

Make deployments on Raspberry Pi easy.

## install
  * ``` npm install -g piriku ```
  * or git clone and put /bin in your path

## usage

  * prerequisites
    * Copy your ssh id on your host to avoid passwords ```ssh-copy-id user@host```
    * Your project should have a .git/ (git init)


  * ``` cd myProject/ && piriku create```
  * reply to the questions
  * git push piriku master

## How to use piriku docker

A docker image is already available on the docker hub.

Create a `piriku` alias:

```
$ alias piriku='docker run -it -v $PWD:/tmp -v $HOME/.ssh:/root/.ssh -v /run/user/$UID/keyring/ssh:/run/user/$UID/keyring/ssh -e UID=$UID -e SSH_AUTH_SOCK=/run/user/$UID/keyring/ssh --rm cgarnier/piriku'
$ piruki

  Usage: piriku [options]

  Options:

    -h, --help        output usage information
    -V, --version     output the version number
    -c, --create      Create the app and initialize it on a host
    -a, --add-remote  Add a git remote to the remote app

```


## project config

### Nodejs

Your nodejs project should have some scripts into the package.json to make
deployment, build, start, stop automatic.

#### build
#### start
#### stop
#### example
```
{
  "name": "sample",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "npm install",
    "start": "forever start index.js",
    "stop": "forever stop index.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.14.0"
  }
}
```


## Roadmap

  * python app hooks
  * package.json's engine support (with nvm)
  * command line, split create and add remote.
