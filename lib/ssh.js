const SSH = require('simple-ssh')
const ssh = new SSH({
  host: 'pi2.irokwa.net',
  port: 22002,
  agent: process.env.SSH_AUTH_SOCK,
  agentForward: true,
  user: 'pi'
})

ssh.exec('ls -la', {
  out (stdout) {
    console.log('out ', stdout)
  },
  err (stderr) {
    console.log('err ', stderr)
  },
  exit (code) {
    console.log('error code', code)
  }
}).start()
