// process.argv routeFolder, routeFile, descriptions
// example1: node src/main.js 'api' 'data/source/api/isf.routes.js' '## Digital Colleagues - dc-isf Service'
// example2: node src/main.js 'ui' '' '## Digital Colleagues - dc-ui'

import apiDashboardGenerator from './apiDashboardGenerator.js'
import uiDashboardGenerator from './uiDashboardGenerator.js'

// take in routeFolder, routeFile, and description as params
const args = process.argv.slice(2)
const service = args[0]
const routeFile = args[1]
const description = args[2]

if (service === 'ui') {
    uiDashboardGenerator({ service, description })
} else if (service === 'api') {
    apiDashboardGenerator({ service, description, routeFile })
} 