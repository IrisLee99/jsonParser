import parse from "json-templates"

import device from "../templates/devices/device.json" assert { type: "json" }
import topUserAgent from "../templates/devices/topUserAgent.json" assert { type: "json" }   

const deviceTemplate = parse(device)
const topUserAgentTemplate = parse(topUserAgent)

// widgets for: Total, TC72, TC70, Win10, Win7, WinXP(red?), CURL(no conditional_formats), Dynatrace (no c_f), Chrome5, 6, 7, 8, 9, 10(no c_f), Other
export default function buildDevicesWidget ({ titles }) {

    let widgets = []
    const palletes = ['black_on_light_green',
        'black_on_light_green', 
        'black_on_light_yellow', 
        'black_on_light_green',
        'black_on_light_yellow',
        'black_on_light_red'
    ]

    const deviceTypes = [
        'Total',
        'TC72',
        'TC70',
        'Windows\\ NT\\ 10\\.0',
        'Windows\\ NT\\ 6\\.1 ',
        'Windows\\ NT\\ 5.1',
        'curl\\/*DEV',
        'RuxitSynthetic\\/1.0',
        'Chrome\\/5',
        'Chrome\\/6',
        'Chrome\\/7',
        'Chrome\\/8',
        'Chrome\\/9',
        '10* OR *Chrome\\/11',
        'Chrome\\/'
    ]

    titles.forEach((title, index) => {
        let x = (index % 6)*2

        const widget =  deviceTemplate({
            title,
            conditionalFormats: index < 6 ? 
            [{     
                comparator: '>',
                value: 0,
                palette: palletes[index]
            }] : [],
            deviceType: title === `*${deviceTypes}*`,
            x,
          })
        widgets.push(widget)
    })

    const TUAwidget = topUserAgentTemplate()
    widgets.push(TUAwidget)
    
    return widgets.flat()
}