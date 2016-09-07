/*
// config file section:
input:
  serverMonitor:
    module: logagent-nodejs-monitor
    SPM_TOKEN: abda900a-XXXX-XXXX-XXXX-c463397f162b
*/
function ServerMonitor (config, eventEmitter) {
  this.config = config.configFile.input.serverMonitor
}

ServerMonitor.prototype = {
  start: function () {
    if (this.config && this.config.SPM_TOKEN) {
      process.env.SPM_TOKEN = this.config.SPM_TOKEN
      process.env.SPM_LOG_TO_CONSOLE = 'true'
      this.spmAgent = require('spm-agent-nodejs')
    }
  },
  stop: function (cb) {
    if (this.agent && this.agent.stop) {
      this.spmAgent.stop()
      cb()
    }
  }
}

module.exports = ServerMonitor
