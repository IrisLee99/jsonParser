import parse from "json-templates"

import loadCurrent from "../templates/replicas/loadCurrent.json" assert { type: "json" }
import loadCurrentPc from "../templates/replicas/loadCurrentPc.json" assert { type: "json" }



export default function buildPrimaryWidgets ({ group, types, query1, query2 }) {

    // query1 = 'kubernetes.cpu.usage.total{$kube-service}'
    // query2 = 'kubernetes.cpu.requests{$kube-service}'

    // query1 = 'kubernetes.memory.usage{$kube-service}'
    // query2 = 'kubernetes.memory.requests{$kube-service}'

    let loadCurrentTemplate
    let formula, x
    let widgets = []
    types.forEach( type => {
        if (type === 'percentage') {
            loadCurrentTemplate = parse(loadCurrentPc)
            formula = '(query1 / 1000000000) * 100 / query2'
            const prefix = group === 'cpu' ? 'avg' : 'sum'
            const midfix = group === 'cpu' ? '.total' : ''
            query1 = `${prefix}:kubernetes.${group}.usage${midfix}{$kube-service}`
            query2 = `${prefix}:kubernetes.${group}.requests{$kube-service}`
            x = 5
        } else if (type === 'count') {
            console.log(type)
            loadCurrentTemplate = parse(loadCurrent)
            formula = 'query1'
            const prefix = 'avg'
            const midfix = group === 'cpu' ? '.total' : ''
            query1 = `${prefix}:kubernetes.${group}.usage${midfix}{$kube-service}`
            x = 6
        }
        console.log(query1)
        console.log(query2)

        const widget =  loadCurrentTemplate({
        formula,
        query1,
        query2,
        x
        })

        widgets.push(widget)
    })

  return widgets

}