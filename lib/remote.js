const prompt = require('prompt')
const fs = require('fs')
const path = require('path')
const q = require('q')
const SSH = require('simple-ssh')
const exec = require('child_process').exec

const cfg = {
  reposPath: 'git',
}

function Init () {

  console.log('Initializing piriku')

  prompt.start()
  prompt.get(['host', 'port', 'user', 'appName'], (err, result) => {
    if (err) {
      console.log(err)
      return 1
    }
    console.log('Summary: ')
    console.log('  host: ' + result.host)
    console.log('  port: ' + result.port)
    console.log('  user: ' + result.user)
    console.log('  appName: ' + result.appName)

    checkConfig(result)
      .then(writeConfig)
      .then(createRepo)
      .then(addRmote)
      .catch((err) => {
        console.log('config sux')
      })
  })
}

module.exports = {
  init: Init
}


function writeConfig (config) {
  fs.writeFileSync('./.piriku', JSON.stringify(config, null, 2))
  return config
}

function checkConfig (config) {
  const defer = q.defer()
  const ssh = new SSH({
    host: config.host,
    port: config.port,
    agent: process.env.SSH_AUTH_SOCK,
    agentForward: true,
    user: config.user
  })

  ssh.exec('echo ok', {
    err (stderr) {
      defer.reject(stderr)
      console.log('err ', stderr)
    },
    exit (code) {
      defer.resolve(config)
      console.log('error code', code)
    }
  })
  .start()

  ssh.on('error', (err) => {
    console.log(err)
    defer.reject()
  })

  return defer.promise
}

function createRepo(config) {
  const defer = q.defer()
  const ssh = new SSH({
    host: config.host,
    port: config.port,
    agent: process.env.SSH_AUTH_SOCK,
    agentForward: true,
    user: config.user
  })

  let dir = '/home/' + config.user + '/' + cfg.reposPath + '/' + config.appName + '.git'
  console.log('dir: ' + dir)
  console.log('tpl ' + __dirname)
  console.log('tpl ' + path.join(__dirname, '../templates/hooks/node/post-receive'))
  ssh.exec('mkdir -p '+ dir + ' && cd ' + dir + ' && git --bare init', {
    out (stdout) {
      console.log('out ', stdout)
    },
    err (stderr) {
      defer.reject(stderr)
      console.log('err ', stderr)
    },
    exit (code) {

    }
  })
  .exec('cat > ' + dir + '/hooks/post-receive', {
    in: fs.readFileSync(path.join(__dirname, '../templates/hooks/node/post-receive')),
    err (stderr) {
      console.log('error cat ', stderr)
    },
    exit (code) {
      defer.resolve(config)
    }
  })
  .exec('chmod +x ' + dir + '/hooks/post-receive')
  .start()

  ssh.on('error', (err) => {
    console.log(err)
    defer.reject()
  })

  return defer.promise
}

function addRmote (config) {
  let rmt = 'ssh://' + config.user + '@' + config.host
    + (config.port !== '22' ? ':' + config.port : '')
    + '/home/pi/git/' + config.appName + '.git'
  console.log('Adding remote `' + rmt + '` to the current repository')
  exec('git remote add piriku ' + rmt, (err, out, stderr) => {
    console.log('err: ' +  err +' , out: ' + out + ', stderr ' + stderr)
  })

  return config
}
