import { object } from "json-templater"

import query from "./templates/commands/elements/query.json" assert { type: "json" }
import firstTemplate from "./templates/commands/first.json" assert { type: "json" }

const prefix = "$kube-namespace $service"

export default function constructFirstWidget ({ urlTitle, url, statusCodes, command }) {
    let count = 1
    let cQueries = []
    statusCodes.forEach((code) => {
      const cName = `query${count}`
      const cQuery = `@res.statusCode:${code} ${prefix} @req.url:${url} @req.method:${command}`
      
      // const JsonObj = JSON.parse(query)

      // render a command query per status code
      const commandQuery = object(query, {
        name: cName,
        query: cQuery,
      })

      //render a widget per query
      // const routeWidget = object(respondTimeSTemplate, {
      //   id: baseId + routeWidgets.length,
      //   title: "Response Time (s)",
      //   query: JsonObj,
      // })

      //combine all route widgets
      // routeWidgets.splice(routeWidgets.length, 0, routeWidget)

      //combine all command queries
      cQueries.splice(cQueries.length, 0, commandQuery)
      count = count + 1
    })

    console.log(cQueries)

    return object(firstTemplate, {
      command,
      urlTitle,
      queries: cQueries
    })
}