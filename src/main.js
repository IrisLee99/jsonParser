import apiDashboardGenerator from './apiDashboardGenerator.js'
import uiDashboardGenerator from './uiDashboardGenerator.js'

const service = 'isf'
const description = '## Digital Colleagues - dc-isf Service'
const routeFile = 'data/source/ui/productApi.routes.js'

// take in routeFolder, routeFile, and description as params
// if routeFolder = api then:
// const service = 'isf'
// dashboardGenerator({ service, description, `api\/${routeFile}` })

// else routeFolder = ui then:
// const service = 'ui'
// dashboardUIGenerator({ service, description, `ui\/${routeFile}` })
uiDashboardGenerator({ service, description, routeFile})