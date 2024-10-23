import load from "../templates/devices/device.json" assert { type: "json" }

const loadTemplate = parse(load)

// widgets for: TC72, TC70, Win10, Win7, WinXP(red?), CURL(no conditional_formats), Dynatrace (no c_f), Chrome5, 6, 7, 8, 9, 10(no c_f), Other
export default function buildDevicesWidgets ({ titles, types }) {

    let widgets = []
    const palletes = ['black_on_light_green', 'black_on_light_yellow', 'black_on_light_red']

    types.map((type, index) => {
        const pallete = palletes[index % 2]
        const x = [index+1] * 2

        const widget =  loadTemplate({
            title: titles[index],
            pallete,
            deviceType: type,
            x
          })


        widgets.push(widget)
    })

    return widgets.flat()
}