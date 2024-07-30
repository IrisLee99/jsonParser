// Read in dc-project/*/routes.js
import fs from 'fs'
import parse from 'json-templates'

import buildPrimaryWidget from './endpoints/buildPrimaryWidget.js'
import buildResponseTimeWidgets from './endpoints/buildResponseTimeWidgets.js'
import buildResponseCountWidgets from './endpoints/buildResponseCountWidgets.js'
import buildReplicaPrimaryWidgets from './replicas/buildPrimaryWidgets.js'

import templateVariables from './templates/variables.json' assert { type: 'json' }
import dashboard from './templates/dashboard.json' assert { type: 'json' }
import commands from './templates/commands/index.json' assert { type: 'json' }
import queries from './templates/queries/index.json' assert { type: 'json' }

const dashboardTemplate = parse(dashboard)
const templateVariablesTemplate = parse(templateVariables)
const commandsTemplate = parse(commands)
const queriesTemplate = parse(queries)


export default function dashboardGenerator({ service, description, routeFile }) {

  const titles = ['CPU Load', 'Memory Load']
  // 1. CPU Load - Current/Desired/Unavailable/Max/Requested
  // 2. Memory Load - Current/Desired/Unavailable/Max/Requested
  const replicaPrimaryWidgets = buildReplicaPrimaryWidgets({ titles })

  // Read in routes.js
  const statusCodes = ['(2* OR 3*)', '4*', '5*']
  const timeTypes = ['seconds', 'p99', 'p95', 'p90']
  const buffer = fs.readFileSync(routeFile, 'utf8')
  const re = /[\'\,]+/g

  let httpRoutes = buffer.split('httpServer.router.')
  httpRoutes.splice(0, 1)

  // total endpoints:
  console.log(httpRoutes.length)

  let commandGroup = [], queryGroup = [], commandWidgets = [], queryWidgets = []
  // Check each array with command and url
  httpRoutes.forEach((route) => {
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

    const primaryWidget = buildPrimaryWidget({ urlTitle, url, statusCodes, command })
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

  // UI routes
  // GET /static/js/app.js
  // const jsonString = '{'req.url':'/static/js/app.js', 'req.method':'GET'}'

  // render template variables
  const variables = templateVariablesTemplate({
    service,
    namespace: 'dcol-sit-f',
  })

  // render dashboard template
  const outputStream = JSON.stringify(
    dashboardTemplate({
      title: service.toUpperCase(),
      description: description,
      widgets: [replicaPrimaryWidgets, commandWidgets, queryWidgets].flat(),
      variables: variables,
    }, null, 2)
  )
  
  // file ouput
  try {
    fs.writeFileSync('data/destination/output.json', outputStream)
  } catch (err) {
    console.log(err)
  }
}
