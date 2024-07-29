//"query": "$ingress-url-prefix $ingress @http.method:POST @http.url:*\\/command\\/pick\\/*\\/start-pick"
//         "$ingress-url-prefix $ingress @http.method:POST @http.url:*\/command\/pick\/*\/start-pick"
import parse from "json-templates"

import responseTimeP9x from "./templates/commands/responseTimeP9x.json" assert { type: "json" }
import responseTimeS from "./templates/commands/responseTimeS.json" assert { type: "json" }

const prefix = '$ingress-url-prefix $ingress'
export default function constructResponseTimeWidget ({ type, url, command, number }) {
    const query = `"${prefix} @http.method:${command} @http.url:*${url}"`

    let x, y, title, width
    if( type === 'seconds') {
        const template = parse(responseTimeS)
        x = 4
        y = 34
        width = 4
        return template({
            title: 'Response Time (s)',
            query,
            number,
            x,
            y,
            width
        })
    } else {
        const template = parse(responseTimeP9x)
        title = type.toUpperCase()
        const width = title.endsWith('9') ? 2 : 1
        if ( type === 'p90') {
            x = 9
            y = 33
        } else if ( type === 'p95') {
            x = 8
            y = 33
        } else {
            title = `Response Time (${title})`
            x = 8
            y = 30
        }
        return template({
            title,
            query,
            number,
            x,
            y,
            width
        })
    }
}