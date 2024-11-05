import parse from "json-templates"

import query from "../templates/commands/elements/query.json" assert { type: "json" }
import primary from "../templates/commands/primary.json" assert { type: "json" }

const primaryTemplate = parse(primary)
const queryTemplate = parse(query)
const prefix = "$kube-namespace $service"

export default function buildPrimaryWidget ({ type, urlTitle, url, statusCodes, command }) {
    let count = 1
    let queries = []
    statusCodes.forEach((code) => {
      const name = `query${count}`
      const query = type === 'api' ? 
      `@res.statusCode:${code} ${prefix} @req.url:${url} @req.method:${command}`
      : `$kube-namespace $kube-deployment $service @http.requested_file:\"${url}\" @http.status:${code}`
      
      // const JsonObj = JSON.parse(query)

      // render a query per status code
      const aQuery = queryTemplate({
        name,
        query,
      })

      //combine all command queries
      queries.splice(queries.length, 0, aQuery)
      count = count + 1
    })

    return primaryTemplate({
      command,
      urlTitle,
      queries
    })
}