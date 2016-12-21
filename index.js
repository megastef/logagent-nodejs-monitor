/*
// config file section:
input:
  serverMonitor:
    module: logagent-nodejs-monitor
    SPM_TOKEN: abda900a-XXXX-XXXX-XXXX-c463397f162b
*/
// kill -USR2 generates a heapdump file in the working directory (/tmp)
var fs = require('fs')

var profileCounter = 0

function cpuProfiler (duration) {
  /* cpu profiler does not compile on Node 7.3.0
  console.log('start profiling, reason SIGUSR1')
  var profiler = require('v8-profiler')
  var snapshot1 = profiler.takeSnapshot()
  var name = profileCounter++ + '-' + new Date().toISOString()
  snapshot1.export(function (error, result) {
    if (!error) {
      fs.writeFileSync('snapshot-' + name + '.heapsnapshot', result)
    }
    snapshot1.delete()
    profiler.startProfiling(name, true)
    setTimeout(function () {
      var profile = profiler.stopProfiling('')
      profile.export(function (error, result) {
        if (!error) {
          fs.writeFileSync('cpu-profile-' + name + '.cpuprofile', result)
        }
        profile.delete()
      })
    }, duration || 10000)
  })
  */
}
process.on('SIGUSR2', cpuProfiler)

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
