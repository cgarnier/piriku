# piriku
Tiny deployment cli based on git.

Make deployments on Raspberry Pi easy.

## install

### Using npm

  ```
  npm install -g piriku
  ```

### Using docker

A docker image is already available on the docker hub.

  * Make the alias

```
alias piriku='docker run -it -v $PWD:/tmp -v $HOME/.ssh:/root/.ssh -v /run/user/$UID/keyring/ssh:/run/user/$UID/keyring/ssh -e UID=$UID -e SSH_AUTH_SOCK=/run/user/$UID/keyring/ssh --rm cgarnier/piriku'
```

  * save it to bash_aliases

```
alias piriku >> ~/.bash_aliases
```

  * try it

```
$ piriki

  Usage: piriku [options]

  Options:

    -h, --help        output usage information
    -V, --version     output the version number
    -c, --create      Create the app and initialize it on a host
    -a, --add-remote  Add a git remote to the remote app

```

## Usage

  * prerequisites
    * Copy your ssh id on your host to avoid passwords ```ssh-copy-id user@host```
    * Your project should have a .git/ (git init)


  * ``` cd myProject/ && piriku create```
  * reply to the questions
  * git push piriku master

## Basic project config

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

## sample

  * Sample node project configured to works out of the box with piriku:

[https://github.com/cgarnier/piriku-sample-node](https://github.com/cgarnier/piriku-sample-node)

## Roadmap

  * python app hooks
  * package.json's engine support (with nvm)
  * command line, split create and add remote.
