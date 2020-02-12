# Monitoring for @sematext/logagent

This plugin provides monitoring for the [@sematext/logagent](https://www.npmjs.com/package/@sematext/logagent) process with [SPM for Node.js](https://sematext.com/spm/integrations/nodejs-monitoring/).

# Installation 

Make sure @sematext/logagent (> v2.0) is installed.

```
npm i -g @sematext/logagent 
npm i -g @sematext/logagent-nodejs-monitor 
```

Then add follwoing lines to your logagent 2.x config file: 

```
input:
  logagentMonitor:
    module: @sematext/logagent-nodejs-monitor
    INFRA_TOKEN: YOUR_SEMATEXT_INFRA_MONITORING_TOKEN
    MONITORING_TOKEN: YOUR_NODEJS_APP_TOKEN
    SPM_LOG_TO_COSOLE: false
    SPM_LOG_LEVEL: error

````

Restart logagent-js service. 

# Documentation

- [Logagent Documentation](https://sematext.com/docs/logagent/)
- [Node.js monitoring](https://sematext.com/docs/integration/node.js/)
