# Monitoring for @sematext/logagent

This plugin provides monitoring for the [@sematext/logagent](https://www.npmjs.com/package/@sematext/logagent) process with [SPM for Node.js](https://sematext.com/spm/integrations/nodejs-monitoring/).

# Installation 

Make sure @sematext/logagent (> v2.0) is installed.

```
npm i -g @sematext/logagent 
npm i -g @semtext/logagent-nodejs-monitor 
```

Then add follwoing lines to your logagent 2.x config file: 

```
input:
  logagentMonitor:
    module: @sematext/logagent-nodejs-monitor
    SPM_TOKEN: YOUR_SPM_FOR_NODEJS_APP_TOKEN
    SPM_LOG_TO_COSOLE: false
    SPM_LOG_LEVEL: error

````

Restart logagent-js service. 




