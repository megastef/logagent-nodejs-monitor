/*
// config file section:
input:
  serverMonitor:
    module: logagent-nodejs-monitor
    SPM_TOKEN: abda900a-XXXX-XXXX-XXXX-c463397f162b
*/
// kill -USR2 generates a heapdump file in the working directory (/tmp)
var fs = require('fs')
var SpmAgent = require('spm-agent')
var profileCounter = 0

function cpuProfiler (duration) {
  console.log('start profiling, reason SIGUSR2')
  // @risingstack/v8-profiler does not compile on Node 8.x -> move to v8-profiler-next
  var profiler = require('v8-profiler-next')
  var snapshot1 = profiler.takeSnapshot()
  var name = profileCounter++ + '-' + new Date().toISOString()
  snapshot1.export(function (error, result) {
    if (!error) {
      var heapdumpFileName = 'snapshot-' + name + '.heapsnapshot'
      fs.writeFileSync(heapdumpFileName, result)
      console.log('saved heapdump ' + heapdumpFileName)
    }
    snapshot1.delete()
    profiler.startProfiling(name, true)
    console.log(
      'start CPU profiler ... pls. wait ' + (duration || 30000) + ' ms'
    )
    setTimeout(function () {
      var profile = profiler.stopProfiling('')
      profile.export(function (error, result) {
        if (!error) {
          var cpuFileName = 'cpu-profile-' + name + '.cpuprofile'
          fs.writeFileSync(cpuFileName, result)
          console.log('saved CPU profile ' + cpuFileName)
        }
        profile.delete()
      })
    }, duration || 30000)
  })
}

function startProfiler () {
  try {
    cpuProfiler()
  } catch (err) {
    console.error(err)
  }
}

process.on('SIGUSR2', startProfiler)

function ServerMonitor (config, eventEmitter) {
  this.config = config
  this.eventEmitter = eventEmitter
}

ServerMonitor.prototype = {
  start: function () {
    if (this.config && this.config.SPM_LOG_TO_CONSOLE !== undefined) {
      process.env.SPM_LOG_TO_CONSOLE = this.config.SPM_LOG_TO_CONSOLE
    }
    if (this.config && this.config.SPM_LOG_LEVEL !== undefined) {
      process.env.SPM_LOG_LEVEL = this.config.SPM_LOG_LEVEL
    }
    if (this.config && this.config.INFRA_TOKEN !== undefined) {
      process.env.INFRA_TOKEN = this.config.INFRA_TOKEN
    }
    if (process.env.MONITORING_TOKEN) {
      if (!this.config.MONITORING_TOKEN) {
        this.config.MONITORING_TOKEN = process.env.MONITORING_TOKEN
      }
    }
    if (this.config && this.config.MONITORING_TOKEN) {
      this.config.SPM_TOKEN = this.config.MONITORING_TOKEN
    }

    if (this.config && this.config.SPM_TOKEN) {
      process.env.SPM_TOKEN = this.config.SPM_TOKEN
      process.env.MONITORING_TOKEN = this.config.SPM_TOKEN
      try {
        this.spmAgent = require('spm-agent-nodejs')
        this.spmAgent.on('error', console.error)
        var eventEmitter = this.eventEmitter
        var config = this.config
        var logagentStatsAgent = new SpmAgent.Agent({
          start: function (agent) {
            eventEmitter.on('logagent-stats', stats => {
              var metrics = {
                measurement: 'logagent',
                tags: {
                  token: process.env.MONITORING_TOKEN || process.env.SPM_TOKEN
                },
                fields: stats
              }
              if (config.debug === true) {
                console.log(metrics)
              }
              agent.addMetrics(metrics)
            })
          },
          stop: function (cb) {
            if (cb) {
              cb()
            }
          }
        })
        this.spmAgent.createAgent(logagentStatsAgent)
      } catch (err) {
        console.error(err)
      }
    }
  },
  stop: function (cb) {
    if (this.agent && this.agent.stop) {
      this.spmAgent.stop()
      cb()
    }
  },
  startProfiler: startProfiler
}

module.exports = ServerMonitor
