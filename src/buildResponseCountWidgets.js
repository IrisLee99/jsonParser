// @res.statusCode:(2* OR 3*) $kube-namespace $service @req.url:\\/command\\/pick\\/*\\/exit-pick @req.method:POST
// @res.statusCode:4* $kube-namespace $service @req.url:\\/command\\/pick\\/*\\/pause-pick @req.method:POST
// @res.statusCode:5* $kube-namespace $service @req.url:\\/command\\/pick\\/*\\/start-pick @req.method:POST
import parse from "json-templates"

import responseCount from "./templates/commands/responseCount.json"  assert { type: "json" }

const prefix = '$kube-namespace $service'

export default function buildResponseCountWidgets ({ url, statusCodes, command  }) {
    let widgets = []
    statusCodes.forEach( code => {
    
    const query = `@res.statusCode:${code} ${prefix} @req.url:${url} @req.method:${command}`
    const colour = code.startsWith('2') ? 'green' : 'yellow'

    const template = parse(responseCount)
    const aWidget = template({
            title: code,
            query,
            colour
        })

        widgets.push(aWidget)
    })

    return widgets
}