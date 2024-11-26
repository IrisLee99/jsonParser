import parse from "json-templates"

import loadCurrent from "../templates/replicas/loadCurrent.json" assert { type: "json" }
import loadCurrentMaxPc from "../templates/replicas/loadCurrentMaxPc.json" assert { type: "json" }



export default function buildLoadCurrentWidgets ({ group, types, query1, query2 }) {

    // query1 = 'kubernetes.cpu.usage.total{$kube-service}'
    // query2 = 'kubernetes.cpu.requests{$kube-service}'

    // query1 = 'kubernetes.memory.usage{$kube-service}'
    // query2 = 'kubernetes.memory.requests{$kube-service}'

    let loadCurrentTemplate
    let formula, x, title
    const titlePrefix = 'Current'
    let widgets = []
    types.forEach( type => {
        if (type === 'percentage') {
            loadCurrentTemplate = parse(loadCurrentMaxPc)
            title = `${titlePrefix} - %`
            formula = '(query1 / 1000000000) * 100 / query2'
            const prefix = group === 'cpu' ? 'avg' : 'sum'
            const midfix = group === 'cpu' ? '.total' : ''
            query1 = `${prefix}:kubernetes.${group}.usage${midfix}{$kube-service}`
            query2 = `${prefix}:kubernetes.${group}.requests{$kube-service}`
            x = group === 'cpu' ? 5 : 10
        } else if (type === 'count') {
            loadCurrentTemplate = parse(loadCurrent)
            title = `${titlePrefix} - count`
            formula = 'query1'
            const prefix = 'avg'
            const midfix = group === 'cpu' ? '.total' : ''
            query1 = `${prefix}:kubernetes.${group}.usage${midfix}{$kube-service}`
            x = group === 'cpu' ? 6 : 11
        }

        const widget =  loadCurrentTemplate({
            title,
            formula,
            query1,
            query2,
            aggregator1: 'last',
            aggregator2: 'avg',
            x,
            y: 0
        })

        widgets.push(widget)
    })

  return widgets

}