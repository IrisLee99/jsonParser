// Read in dc-project/*/routes.js
import fs from 'fs'
import parse from 'json-templates'

import buildPrimaryWidget from './endpoints/buildPrimaryWidget.js'
import buildResponseTimeWidgets from './endpoints/buildResponseTimeWidgets.js'
import buildResponseCountWidgets from './endpoints/buildResponseCountWidgets.js'
import buildLoadWidgets from './replicas/buildLoadWidgets.js'
import buildReplicaWidgets from './replicas/buildReplicaWidgets.js' 

import templateVariables from './templates/variables.json' assert { type: 'json' }
import dashboard from './templates/dashboard.json' assert { type: 'json' }
import commands from './templates/commands/index.json' assert { type: 'json' }
import queries from './templates/queries/index.json' assert { type: 'json' }
import replica from './templates/replicas/index.json' assert { type: 'json'}

const dashboardTemplate = parse(dashboard)
const templateVariablesTemplate = parse(templateVariables)
const commandsTemplate = parse(commands)
const queriesTemplate = parse(queries)
const replicaTemplate = parse(replica)

export default function apiDashboardGenerator({ serviceName, description, routeFile, namespace }) {

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

  // Read in routes.js
  const statusCodes = ['(2* OR 3*)', '4*', '5*']
  const timeTypes = ['seconds', 'p99', 'p95', 'p90']
  const buffer = fs.readFileSync(routeFile, 'utf8')
  const re = /[\'\,]+/g

  let httpRoutes = buffer.split('httpServer.router.')
  httpRoutes.splice(0, 1)

  let commandGroup = [], queryGroup = [], commandWidgets = [], queryWidgets = []
  // Check each array with command and url
  httpRoutes.forEach((route) => {
    const width = 4
    const lines = route.split('\n')
    const command = lines[0].replaceAll('(', '').trim().toUpperCase()
    const urlTitle = lines[1].replaceAll(re, '').trim()

    // remove variables in query url
    const strings = urlTitle.split('/').filter(str => str !== '').map( str => { 
      if (str.startsWith(':')) return '*'
      else return str 
    })
    const url = strings.reduce(
      (accumulator, currentValue) => accumulator.concat(`\\/${currentValue}`),
      '',
    )

    const primaryWidget = buildPrimaryWidget({ type: 'api', urlTitle, url, statusCodes, command, width })
    const responseTimeWidgets = buildResponseTimeWidgets({ timeTypes, url, command })
    const responseCountWidgets = buildResponseCountWidgets({ url, statusCodes, command })

    const widgets = [
      primaryWidget,
      responseTimeWidgets,
      responseCountWidgets].flat()

      if ( command === 'POST') {
        commandGroup.push(widgets)
      } else {
        queryGroup.push(widgets)
      }
  })

  commandWidgets = commandsTemplate({
    widgets: commandGroup.flat()
  })

  queryWidgets = queriesTemplate({
    widgets: queryGroup.flat()
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
      widgets: [replicaStatisticsWidgets, commandWidgets, queryWidgets].flat(),
      variables: variables,
    }, null, 2)
  )
  
  // file ouput
  try {
    fs.writeFileSync(`dashboard-generator/data/destination/${serviceName}-dashboard-${namespace}.json`, outputStream)
  } catch (err) {
    console.error(`Cannot generate api ${serviceName} with error: ` + err)
  }

  return outputStream
}
