import apiDashboardGenerator from './apiDashboardGenerator.js'
import uiDashboardGenerator from './uiDashboardGenerator.js'

// take in routeFolder, routeFile, and description as params
// if routeFolder = api then:
const service = 'isf'
const description = '## Digital Colleagues - dc-isf Service'
const routeFile = 'data/source/api/isf.routes.js'
apiDashboardGenerator({ service, description, routeFile })

// else routeFolder = ui then:
// const service = 'ui'
// const description = '## Digital Colleagues - dc-ui'
// uiDashboardGenerator({ service, description})