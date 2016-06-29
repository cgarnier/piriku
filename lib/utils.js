const fs = require('fs')

module.exports = {
  gitUri,
  projectPath,
  log,
  detectTechno
}

function gitUri (settings) {
  return 'ssh://' + settings.user + '@' + settings.host +
    (settings.port === '22' ? ':' : ':' + settings.port) +
    projectPath(settings)
}

function projectPath (settings) {
  return '/home/' + settings.user + '/git/' + settings.name + '.git'
}

function log (message) {
  console.log(message)
}

/**
 * Detect the techo
 * TODO make it as plugins
 * @returns {string}
 */
function detectTechno () {
  log('Trying to detect the project techno...')
  if (fs.existsSync('./package.json')) {
    log('  looks like a node.js project')
    return 'node'
  }
  throw new Error('Unable to determine the techno of this project')
}
