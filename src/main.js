// process.argv routeFolder, routeFile, descriptions
// example1: node src/main.js 'api' 'data/source/api/isf.routes.js' '## Digital Colleagues - dc-isf Service'
// example2: node src/main.js 'ui' '' '## Digital Colleagues - dc-ui'

import apiDashboardGenerator from './apiDashboardGenerator.js'
import uiDashboardGenerator from './uiDashboardGenerator.js'

// take in routeFolder, routeFile, and description as params
const args = process.argv.slice(2)
const serviceType = args[0]
const serviceName = args[1]
const routeFile = args[2] || ''
const description = `## Digital Colleagues - ${serviceName}`

let outputStream
if (serviceType === 'ui') {
    outputStream = uiDashboardGenerator({ serviceName, description, namespace: 'dcol-sit-h' })
} else if (serviceType === 'api') {
    outputStream = apiDashboardGenerator({ serviceName, description, routeFile, namespace: 'dcol-sit-h' })
} 

process.stdout.write(`${outputStream}\n`);