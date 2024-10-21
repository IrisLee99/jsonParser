import fs from 'fs'
import parse from 'json-templates'
import buildPrimaryWidget from './endpoints/buildPrimaryWidget.js'
import dashboard from './templates/dashboard.json' assert { type: 'json' }
import buildLoadWidgets from './replicas/buildLoadWidgets.js'
import templateVariables from './templates/variables.json' assert { type: 'json' }

const dashboardTemplate = parse(dashboard)
const templateVariablesTemplate = parse(templateVariables)

export default function uiDashboardGenerator({ service, description }) {

  const titles = ['CPU Load', 'Memory Load']
  const types = ['percentage', 'count']
  // 1. CPU Load - Current/Desired/Unavailable/Max/Requested
  // 2. Memory Load - Current/Desired/Unavailable/Max/Requested
  const replicaWidgets = buildLoadWidgets({ titles, types })

  // file statistics
  const urlTitle = 'File Statistics'
  const statusCodes = ['2*', '3*', '4*', '5*']
  const command = 'GET /static/js/app.js'

  // const primaryWidget = buildPrimaryWidget({ urlTitle, url, statusCodes, command })

  // const widgets = [
  //   primaryWidget
  // ].flat()

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
      widgets: [replicaWidgets].flat(),
      variables: variables,
    }, null, 2)
  )

  try {
    fs.writeFileSync('data/destination/UIoutput.json', outputStream)
  } catch (err) {
    console.log('Cannot generate ui dashboard with error: ' + err)
  }
}