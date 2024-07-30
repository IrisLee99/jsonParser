//"query": "$ingress-url-prefix $ingress @http.method:POST @http.url:*\\/command\\/pick\\/*\\/start-pick"
//         "$ingress-url-prefix $ingress @http.method:POST @http.url:*\/command\/pick\/*\/start-pick"
import parse from "json-templates"

import responseTimeP9x from "../templates/commands/responseTimeP9x.json" assert { type: "json" }
import responseTimeSeconds from "../templates/commands/responseTimeSeconds.json" assert { type: "json" }

const prefix = '$ingress-url-prefix $ingress'
export default function buildResponseTimeWidgets ({ timeTypes, url, command }) {
    const query = `${prefix} @http.method:${command} @http.url:*${url}`
    console.log(query)

    let widgets = []
    let x, title
    timeTypes.forEach(type => {
        let aWidget, template
        if( type === 'seconds') {
            console.log('response time (s)')
            template = parse(responseTimeSeconds)
            x = 4

            aWidget = template({
                title: 'Response Time (s)',
                query,
                x
            })
        } else {
            let number
            template = parse(responseTimeP9x)
            title = type.toUpperCase()
            const width = title.endsWith('9') ? 2 : 1
            const x = title.endsWith('0') ? 9 : 8
            if ( type === 'p99'){
                title = `Response Time (${title})`
            }
            
            aWidget = template({
                title,
                query,
                number : eval(type.replace('p', '')),
                x,
                width
            })
        }

        widgets.push(aWidget)
    })
    return widgets
}