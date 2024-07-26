//"query": "$ingress-url-prefix $ingress @http.method:POST @http.url:*\\/command\\/pick\\/*\\/start-pick"
//         "$ingress-url-prefix $ingress @http.method:POST @http.url:*\/command\/pick\/*\/start-pick"
import parse from "json-templates"

import responseTimeP99 from "./templates/commands/responseTimeP99.json" assert { type: "json" }
import responseTimeS from "./templates/commands/responseTimeS.json" assert { type: "json" }

const prefix = '$ingress-url-prefix $ingress'
export default function constructResponseTimeWidget ({ type, url, command }) {
    const query = `"${prefix} @http.method:${command} @http.url:*${url}"`

    const template = type === 'seconds' ? parse(responseTimeS) : parse(responseTimeP99)
    return template({
        query
    })
}