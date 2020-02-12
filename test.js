var LogagentMonitor = require('./index.js')
console.log('pid: ' + process.pid)
// simulate LA monitor loading, usually done in @sematext/logagent
function testMonitor () {
  var EE = require('events').EventEmitter
  // Logagent loads the configfrom a yaml file
  // we simply pass a JSON object
  var config = {
    debug: true,
    SPM_TOKEN: 'TEST',
    SPM_LOG_TO_CONSOLE: 'true',
    SPM_LOG_LEVEL: 'debug'
  }
  // create and start the plugin - normally done by logagent ...
  var ee = new EE()
  var plugin = new LogagentMonitor(config, ee)
  plugin.start()
  plugin.startProfiler()

  // simulate a client
  setInterval(function () {
    ee.emit('logagent-stats', { count: 1 })
  }, 1000)
}

if (require.main === module) {
  testMonitor()
}
