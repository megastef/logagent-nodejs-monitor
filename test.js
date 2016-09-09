var LogagentMonitor = require('./index.js')
// simulate LA monitor loading, usually done in @sematext/logagent
function testMonitor () {
  var EE = require('events').EventEmitter
  // Logagent loads the configfrom a yaml file
  // we simply pass a JSON object
  var config = {
    configFile: {
      input: {
        logagentMonitor: {
          SPM_TOKEN: 'TEST',
          SPM_LOG_TO_CONSOLE: 'false',
          SPM_LOG_LEVEL: 'error'
        }
      }
    }
  }
  // create and start the plugin - normally done by logagent ...
  var plugin = new LogagentMonitor(config, new EE())
  plugin.start()
  // simulate a client
  setInterval(function () {}, 1000)
}

if (require.main === module) {
  testMonitor()
}
