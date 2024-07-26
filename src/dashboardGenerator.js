// Read in dc-project/*/routes.js
import fs from "fs"
import object from "json-templater/object.js"

import constructFirstWidget from "./constructFirstWidget.js"
import constructResponseTimeWidget from "./constructResponseTimeWidget.js"

import templateVariablesTemplate from "./templates/variables.json" assert { type: "json" }
import dashboardTemplate from "./templates/dashboard.json" assert { type: "json" }
import commandsTemplate from "./templates/commands/index.json" assert { type: "json" }

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

    const firstWidget = constructFirstWidget({ urlTitle, url, statusCodes, command })
    const responseTimeSWidget = constructResponseTimeWidget({ url, command })

    commandWidgets = object(commandsTemplate, {
      firstWidget,
      responseTimeSWidget
    })
  })

  // UI routes
  // GET /static/js/app.js
  // const jsonString = '{"req.url":"/static/js/app.js", "req.method":"GET"}'

  // render template variables
  const variables = object(templateVariablesTemplate, {
    service,
    namespace: "dc-sit-f",
  })

  // TODO: render other widgets - using widget.json or other templates
  // 1. Replicas Available
  // 2. CPU Load - Current/Desired/Unavailable/Max/Requested
  // 3. Memory Load - Current/Desired/Unavailable/Max/Requested

  // render dashboard template
  const outputStream = JSON.stringify(
    object(dashboardTemplate, {
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
