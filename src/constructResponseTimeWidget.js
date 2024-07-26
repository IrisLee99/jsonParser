//"query": "$ingress-url-prefix $ingress @http.method:POST @http.url:*\\/command\\/pick\\/*\\/start-pick"
//         "$ingress-url-prefix $ingress @http.method:POST @http.url:*\/command\/pick\/*\/start-pick"
import { object } from "json-templater"
import respondTimeSTemplate from "./templates/commands/respondTimeS.json" assert { type: "json" }

const prefix = '$ingress-url-prefix $ingress'
export default function constructResponseTimeWidget ({ url, command }) {
    const query = `"${prefix} @http.method:${command} @http.url:*${url}"`

    console.log(query)
    return object(respondTimeSTemplate, {
        query
    }
    )
}