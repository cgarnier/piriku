const pkg = require('../package.json')
const prompt = require('prompt')
const q = require('q')
const path = require('path')
const fs = require('fs')

const utils = require('./utils')
const remote = require('./remote.js')

function create () {
  var settings = {}
  let techno = utils.detectTechno()
  promptSettings(techno)
    .then((s) => {
      settings = s
      settings.techno = techno
      return settings
    })
    .then(remote.checkSSHConnection)
    .then(remote.createRepo)
    .then(remote.removeExistingRemote)
    .then(remote.addRemote)
    .then(remote.writeConfig)
    .then(createSuccess)
    .catch((err) => {
      console.log('Error: ', err)
    })
}

function addRemote () {
  var settings = {}
  promptSettings()
    .then((s) => {
      settings = s
      return settings
    })
    .then(remote.checkSSHConnection)
    .then(remote.removeExistingRemote)
    .then(remote.addRemote)
    .then(remote.writeConfig)
    .then(createSuccess)
    .catch((err) => {
      console.log('Error: ', err)
    })
}

function remove () {
  throw 'Not implemented yet'
}

module.exports = {
  create: create,
  addRemote: addRemote,
  remove: remove
}

function promptSettings (techno) {
  var name = path.basename(process.cwd())

  // TODO move to the future node plugin
  if (techno === 'node') {
    var data = fs.readFileSync(path.join(process.cwd(), './package.json'))
    var pkg = JSON.parse(data.toString())
    name = pkg.name
  }
  let defer = q.defer()
  let schema = {
    properties: {
      name: {
        description: 'Application name',
        default: name,
        required: true
      },
      host: {
        description: 'SSH host (or ip address)',
        default: 'pi2.irokwa.net',
        required: true
      },
      port: {
        description: 'SSH port',
        // default: '22',
        default: '22002',
        required: true
      },
      user: {
        description: 'SSH user',
        default: 'pi',
        required: true
      }
    }
  }

  prompt.start()
  prompt.get(schema, (err, result) => {
    if (err) {
      defer.reject(err)
      return
    }
    console.log('Command line input received:')
    console.log('  Application name: \t\t' + result.name)
    console.log('  SSH host: \t\t' + result.host)
    console.log('  SSH port: \t\t' + result.port)
    console.log('  SSH user: \t\t' + result.user)
    defer.resolve(result)
  })

  return defer.promise
}

function createSuccess (settings) {
  utils.log('\n ##########')
  utils.log('\n')
  utils.log('Your project is now setup to deploy with piriku')
  utils.log('\n')
  utils.log('\n')
  utils.log('  To deploy your master use:')
  utils.log('    git push piriku master')
  utils.log('\n')
  utils.log('  To deploy your current branch use:')
  utils.log('    git push piriku +HEAD:master')
  utils.log('\n')
  utils.log('\n')

  return settings
}
