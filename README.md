# Monitoring for logagent-js

This plugin provides monitoring for the loagagent-js service.
It collects host and nodejs specific metrics and ships the metrics to [SPM for Node.js](https://sematext.com/spm/integrations/nodejs-monitoring/). 

You can create alerts when the log shippers stops working or when it creates a high load while processing a larger colume of logs. 

# Installation 

Make sure logagent-js > 2.0 is installed

```
npm i megastef/logagent-nodejs-monitor -g 
```

Then add follwoing lines to your logagent 2.x config file: 

```
input:
  serverMonitor:
    module: logagent-nodejs-monitor
    SPM_TOKEN: YOUR_SPM_FOR_NODEJS_APP_TOKEN

````

Restart logagent-js service. 




