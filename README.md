## Generating

For local dashboard generating, follow these steps:

# UI
node ./src/main.js ui 'ui'

The output dashboard json file will be generated in the folder: dashboard-generator/data/destination/dc-ui-dashboard-{env}.json

# API
node ./jsonParser/src/main api 'isf' 'dashboard-generator/data/source/api/isf/routes.js'

The output dashboard json file will be generated in the folder: dashboard-generator/data/destination/{serviceName}-dashboard-{env}.json