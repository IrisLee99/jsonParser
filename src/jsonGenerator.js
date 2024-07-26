// Read in dc-project/*/routes.js
import fs from "fs"
import object from "json-templater/object.js"

import firstWidgetTemplate from "./templates/commands/firstWidget.json" assert { type: "json" }
import respondTimeS from "./templates/commands/respondTimeS.json" assert { type: "json" }
import templateVariables from "./templates/variables.json" assert { type: "json" }
import dashboard from "./templates/dashboard.json" assert { type: "json" }
import commandsTemplate from "./templates/commands/commands.json" assert { type: "json" }
import query from "./templates/commands/elements/query.json" assert { type: "json" }

export default function jsonGenerator({ service, description, routeFile }) {
  // Read in routes.js
  const statusCodes = ["(2* OR 3*)", "4*", "5*"]
  const prefix = "$kube-namespace $service"
  const buffer = fs.readFileSync(routeFile, "utf8")
  const re = /[\'\,]+/g
  const baseId = 6748651480114544

  let httpRoutes = buffer.split("httpServer.router.")
  httpRoutes.splice(0, 1)

  // total endpoints:
  console.log(httpRoutes.length)

  let routeWidgets = []
  let commandQueries = []
  let firstWidget
  let commandWidget
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
    console.log(strings)
    const url = strings.reduce(
      (accumulator, currentValue) => accumulator.concat(`/${currentValue}`),
      '',
    );
    console.log(url)

    // Map every endpoint to jsonString
    let count = 1
    statusCodes.forEach((code) => {
      const cName = `query${count}`
      const cQuery = `@res.statusCode:${code} ${prefix} @req.url:${url} @req.method:${command}`
      // const query = `{"query": "${prefix} @req.url:${url}/* @req.method:${command} @req.statusCode:${code}"}`
      // const JsonObj = JSON.parse(query)

      // render a command query per status code
      const commandQuery = object(query, {
        name: cName,
        query: cQuery,
      })

      //render a widget per query
      // const routeWidget = object(respondTimeS, {
      //   id: baseId + routeWidgets.length,
      //   title: "Response Time (s)",
      //   query: JsonObj,
      // })

      //combine all route widgets
      // routeWidgets.splice(routeWidgets.length, 0, routeWidget)

      //combine all command queries
      commandQueries.splice(commandQueries.length, 0, commandQuery)
      count = count + 1
    })

    console.log(commandQueries)

    firstWidget = object(firstWidgetTemplate, {
      command,
      urlTitle,
      queries: commandQueries
    })

    commandWidget = object(commandsTemplate, {
      firstWidget
    })

  })

  // UI routes
  // GET /static/js/app.js
  // const jsonString = '{"req.url":"/static/js/app.js", "req.method":"GET"}'

  // render template variables
  const variables = object(templateVariables, {
    service,
    namespace: "dc-production",
  })

  // TODO: render other widgets - using widget.json or other templates
  // 1. Replicas Available
  // 2. CPU Load - Current/Desired/Unavailable/Max/Requested
  // 3. Memory Load - Current/Desired/Unavailable/Max/Requested

  // render dashboard template
  const outputStream = JSON.stringify(
    object(dashboard, {
      title: service,
      description: description,
      widgets: [commandWidget],
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
