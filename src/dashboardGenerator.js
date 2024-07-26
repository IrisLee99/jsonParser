// Read in dc-project/*/routes.js
import fs from "fs"
import parse from "json-templates"

import buildFirstWidget from "./buildFirstWidget.js"
import buildResponseTimeWidget from "./buildResponseTimeWidget.js"
import buildResponseCountWidgets from "./buildResponseCountWidgets.js"

import templateVariables from "./templates/variables.json" assert { type: "json" }
import dashboard from "./templates/dashboard.json" assert { type: "json" }
import commands from "./templates/commands/index.json" assert { type: "json" }

const dashboardTemplate = parse(dashboard)
const templateVariablesTemplate = parse(templateVariables)
const commandsTemplate = parse(commands)

export default function dashboardGenerator({ service, description, routeFile }) {
  // Read in routes.js
  const statusCodes = ["(2* OR 3*)", "4*", "5*"]
  const buffer = fs.readFileSync(routeFile, "utf8")
  const re = /[\'\,]+/g

  let httpRoutes = buffer.split("httpServer.router.")
  httpRoutes.splice(0, 1)

  // total endpoints:
  console.log(httpRoutes.length)

  let routeWidgets = []
  let commandWidgets
  // Check each array with command and url
  httpRoutes.forEach((route) => {
    const lines = route.split("\n")
    const command = lines[0].replaceAll("(", "").trim().toUpperCase()
    const urlTitle = lines[1].replaceAll(re, "").trim()

    // remove variables in query url
    const strings = urlTitle.split("/").filter(str => str !== '').map( str => { 
      if (str.startsWith(':')) return '*'
      else return str 
    })
    const url = strings.reduce(
      (accumulator, currentValue) => accumulator.concat(`\\\\\/${currentValue}`),
      '',
    )
    console.log(url)

    const firstWidget = buildFirstWidget({ urlTitle, url, statusCodes, command })
    const responseTimeSWidget = buildResponseTimeWidget({ type: 'seconds', url, command })
    const responseTimeP99Widget = buildResponseTimeWidget({ type: 'p99', url, command })
    const responseWidgets = buildResponseCountWidgets({ url, statusCodes, command })

    commandWidgets = commandsTemplate({
      firstWidget,
      responseTimeSWidget,
      responseTimeP99Widget,
      responseWidgets
    })
  })

  // UI routes
  // GET /static/js/app.js
  // const jsonString = '{"req.url":"/static/js/app.js", "req.method":"GET"}'

  // render template variables
  const variables = templateVariablesTemplate({
    service,
    namespace: "dc-sit-f",
  })

  // TODO: render other widgets - using widget.json or other templates
  // 1. Replicas Available
  // 2. CPU Load - Current/Desired/Unavailable/Max/Requested
  // 3. Memory Load - Current/Desired/Unavailable/Max/Requested

  // render dashboard template
  const outputStream = JSON.stringify(
    dashboardTemplate({
      title: service,
      description: description,
      widgets: [commandWidgets],
      variables: variables,
    }, null, 2)
  )
  console.log(outputStream)

  // file ouput
  try {
    fs.writeFileSync("data/destination/output.json", outputStream)
  } catch (err) {
    console.log(err)
  }
}
