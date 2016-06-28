const prompt = require('prompt')
const fs = require('fs')
const path = require('path')
const q = require('q')
const SSH = require('simple-ssh')
const exec = require('child_process').exec
const utils = require('./utils')

module.exports = {
  checkSSHConnection: checkSSHConnection,
  createRepo: createRepo,
  addRemote: addRemote,
  removeExistingRemote: removeExistingRemote,
  writeConfig: writeConfig
}


function writeConfig (settings) {
  utils.log('Writing settings to .piriku')
  fs.writeFileSync('./.piriku', JSON.stringify(settings, null, 2))
  utils.log('  Done')
  return settings
}

function checkSSHConnection (settings) {
  utils.log('Checking connection to the host...')
  const defer = q.defer()
  const ssh = new SSH({
    host: settings.host,
    port: settings.port,
    agent: process.env.SSH_AUTH_SOCK,
    agentForward: true,
    user: settings.user
  })

  ssh.exec('git --version', {
    err (stderr) {
      defer.reject('  ' + stderr)
    },
    exit (code) {
      if (code !== 0) {
        defer.reject('  git must to be installed on the host (sudo apt-get install git)')
        return
      }
      utils.log('  success')
      defer.resolve(settings)
    }
  })
  .start()

  ssh.on('error', (err) => {
    defer.reject(err.message)
  })

  return defer.promise
}

function createRepo (settings) {
  utils.log('Creating remote repo...')
  const defer = q.defer()
  const ssh = new SSH({
    host: settings.host,
    port: settings.port,
    agent: process.env.SSH_AUTH_SOCK,
    agentForward: true,
    user: settings.user
  })

  let dir = utils.projectPath(settings)
  let lastError = ''

  ssh.exec('mkdir -p ' + dir + ' && cd ' + dir + ' && git --bare init', {
    err (stderr) {
      lastError = stderr
    },
    exit (code) {
      if (code !== 0) {
        defer.reject('Error (' + code + '): ' + lastError)
      }
      utils.log('  Project successfully created')
    }
  })
  .exec('cat > ' + dir + '/hooks/post-receive', {
    in: fs.readFileSync(path.join(__dirname, '../templates/hooks/node/post-receive')),
    err (stderr) {
      lastError = stderr
    },
    exit (code) {
      if (code !== 0) {
        defer.reject('Error (' + code + '): ' + lastError)
      }
      utils.log('  post-receive hook copied')
    }
  })
  .exec('chmod +x -R ' + dir + '/hooks', {
    err (stderr) {
      lastError = stderr
    },
    exit (code) {
      if (code !== 0) {
        defer.reject('Error (' + code + '): ' + lastError)
        return
      }
      defer.resolve(settings)
      utils.log('  Execution right set on hooks')
    }
  })
  .start()

  ssh.on('error', (err) => {
    defer.reject('Error: ' + err)
  })

  return defer.promise
}

function addRemote (settings) {
  let rmt = utils.gitUri(settings)

  let defer = q.defer()
  utils.log('Adding remote `' + rmt + '` to the current repository...')
  exec('git remote add piriku ' + rmt, (err, out, stderr) => {
    if (err) {
      return defer.reject('Error: ' + err)
    }
    utils.log('  Done')
    defer.resolve(settings)
  })

  return defer.promise
}

function removeExistingRemote (settings) {
  let defer = q.defer()
  utils.log('Removing existing piriku remote...')
  exec('git remote remove piriku', () => {
    // err should be missing remote. Ignore
    utils.log('  Done')
    defer.resolve(settings)
  })
  return defer.promise
}
