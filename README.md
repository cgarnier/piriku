# piriku
Tiny deployment cli based on git.

Make deployments on Raspberry Pi easy.

## install
  * ``` npm install -g piriku ``` Coming soon
  * or git clone and put /bin in your path

## usage

  * prerequisites
    * Copy your ssh id on your host to avoid passwords ```ssh-copy-id user@host```



  * ``` piriku ```
  * reply to the questions
  * git push piriku master


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
