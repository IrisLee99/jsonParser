import fs from 'fs'
import parse from 'json-templates'
import buildPrimaryWidget from './endpoints/buildPrimaryWidget.js'
import dashboard from './templates/dashboard.json' assert { type: 'json' }
import buildLoadWidgets from './replicas/buildLoadWidgets.js'
import templateVariables from './templates/variables.json' assert { type: 'json' }
import file from './templates/file/index.json' assert { type: 'json' }

const dashboardTemplate = parse(dashboard)
const templateVariablesTemplate = parse(templateVariables)
const fileTemplate = parse(file)

export default function uiDashboardGenerator({ service, description }) {

  const titles = ['CPU Load', 'Memory Load']
  const types = ['percentage', 'count']
  // 1. CPU Load - Current/Desired/Unavailable/Max/Requested
  // 2. Memory Load - Current/Desired/Unavailable/Max/Requested
  const replicaWidgets = buildLoadWidgets({ titles, types })

  // file statistics
  const urlTitle = ''
  const statusCodes = ['2*', '4*', '5*']
  const url = '/static/js/app.js'
  const command = `GET ${url}`

  const primaryWidget = buildPrimaryWidget({ type: 'ui', urlTitle, url, statusCodes, command })

  console.log('=============')
  console.log(primaryWidget)
  const fileWidgets = fileTemplate({
    widgets: [primaryWidget]
  })
  

  // render template variables
  const variables = templateVariablesTemplate({
    service: 'ui',
    namespace: 'dcol-sit-h',
  })

  // render dashboard template
  const outputStream = JSON.stringify(
    dashboardTemplate({
      title: service.toUpperCase(),
      description,
      widgets: [replicaWidgets, fileWidgets].flat(),
      variables: variables,
    }, null, 2)
  )

  try {
    fs.writeFileSync('data/destination/UIoutput.json', outputStream)
  } catch (err) {
    console.log('Cannot generate ui dashboard with error: ' + err)
  }
}