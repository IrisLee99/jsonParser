import jsonGenerator from './jsonGenerator.js'

const service = 'DCOL - isf'
const description = '## Digital Colleagues - dc-isf Service'
const routeFile = 'data/source/isf.routes.js'

jsonGenerator({ service, description, routeFile })