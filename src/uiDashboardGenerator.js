import fs from 'fs'
import parse from 'json-templates'
import buildPrimaryWidget from './endpoints/buildPrimaryWidget.js'
import buildResponseCountWidgets from './endpoints/buildResponseCountWidgets.js'
import dashboard from './templates/dashboard.json' assert { type: 'json' }
import buildLoadWidgets from './replicas/buildLoadWidgets.js'
import buildDevicesWidget from './devices/buildDevicesWidget.js' 
import buildReplicaWidgets from './replicas/buildReplicaWidgets.js' 
import templateVariables from './templates/variables.json' assert { type: 'json' }
import replica from './templates/replicas/index.json' assert { type: 'json'}
import file from './templates/file/index.json' assert { type: 'json' }
import device from './templates/devices/index.json' assert { type: 'json'}

const dashboardTemplate = parse(dashboard)
const templateVariablesTemplate = parse(templateVariables)
const replicaTemplate = parse(replica)
const fileTemplate = parse(file)
const deviceTemplate = parse(device)

export default function uiDashboardGenerator({ serviceName, description, namespace }) {

  // Replica Statistics
  const replicaWidgets = buildReplicaWidgets({})

  // 1. CPU Load - Current/Desired/Unavailable/Max/Requested
  // 2. Memory Load - Current/Desired/Unavailable/Max/Requested
  const titles = ['CPU Load', 'Memory Load']
  const types = ['percentage', 'count', 'Max', 'Requested']
  const loadWidgets = buildLoadWidgets({ titles, types })

  const replicaStatisticsWidgets = replicaTemplate({
    widgets: [replicaWidgets, loadWidgets].flat()
  })


  // File Statistics
  const width = 10
  const urlTitle = ''
  const statusCodes = ['(2* OR 3*)', '4*', '5*']
  const url = '/static/js/app.js'
  const command = `GET ${url}`

  const primaryWidget = buildPrimaryWidget({ type: 'ui', urlTitle, url, statusCodes, command, width })
  const responseCountWidgets = buildResponseCountWidgets({ url, statusCodes, command })

  const fileStatisticsWidgets = fileTemplate({
    widgets: [primaryWidget, responseCountWidgets].flat()
  })
  
  // Device Statistics (Unique by IP)
  const deviceTitles = ['Total', 'TC72', 'TC70',
    'Windows 10', 'Windows 7', 'Windows XP', 
    'CURL', 'Dynatrace',
    'Chrome 5x', 'Chrome 6x', 'Chrome 7x', 'Chrome 8x', 'Chrome 9x', 'Chrome 1xx', 'Other']
  const deviceWidget = buildDevicesWidget({ titles: deviceTitles })

  const deviceWidgets = deviceTemplate({
    widgets: deviceWidget
  })
  // render template variables
  const variables = templateVariablesTemplate({
    serviceName,
    namespace,
  })

  // render dashboard template
  const outputStream = JSON.stringify(
    dashboardTemplate({
      title: serviceName.toUpperCase(),
      description,
      widgets: [replicaStatisticsWidgets, fileStatisticsWidgets, deviceWidgets].flat(),
      variables: variables,
    }, null, 2)
  )

  try {
    fs.writeFileSync(`dashboard-generator/data/destination/${serviceName}-dashboard-${namespace}.json`, outputStream)
  } catch (err) {
    console.error(`Cannot generate ${serviceName} dashboard with error: ` + err)
  }

  return outputStream

}