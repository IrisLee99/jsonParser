import dashboardGenerator from './dashboardGenerator.js'

const service = 'isf'
const description = '## Digital Colleagues - dc-isf Service'
const routeFile = 'data/source/isf.routes.js'

dashboardGenerator({ service, description, routeFile })