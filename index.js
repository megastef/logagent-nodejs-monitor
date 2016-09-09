/*
// config file section:
input:
  serverMonitor:
    module: logagent-nodejs-monitor
    SPM_TOKEN: abda900a-XXXX-XXXX-XXXX-c463397f162b
*/
function ServerMonitor (config, eventEmitter) {
  this.config = config.configFile.input.logagentMonitor
}

ServerMonitor.prototype = {
  start: function () {
    if (this.config && this.config.SPM_LOG_TO_CONSOLE !== undefined) {
      process.env.SPM_LOG_TO_CONSOLE = this.config.SPM_LOG_TO_CONSOLE
    }
    if (this.config && this.config.SPM_LOG_LEVEL !== undefined) {
      process.env.SPM_LOG_LEVEL = this.config.SPM_LOG_LEVEL
    }
    if (this.config && this.config.SPM_TOKEN) {
      process.env.SPM_TOKEN = this.config.SPM_TOKEN
      try {
        this.spmAgent = require('spm-agent-nodejs')
        this.spmAgent.on('error', console.log)
      } catch (err) {}
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
