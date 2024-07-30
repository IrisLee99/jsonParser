import parse from "json-templates"

import load from "../templates/replicas/load.json" assert { type: "json" }

const loadTemplate = parse(load)

export default function buildPrimaryWidgets ({ titles }) {

  let formula, query1, query2, x
  let widgets = []
  titles.forEach( title => {

    if (title.startsWith('CPU')) {
      formula = '(query1 / 1000000000) * 100 / query2'
      query1 = 'avg:kubernetes.cpu.usage.total{$kube-service}'
      query2 = 'avg:kubernetes.cpu.requests{$kube-service}'
      x = 2
    } else if (title.startsWith('Memory')) {
      formula = 'query1 * 100 / query2'
      query1 = 'sum:kubernetes.memory.usage{$kube-service}'
      query2 = 'sum:kubernetes.memory.requests{$kube-service}'
      x = 7
    }

    const widget =  loadTemplate({
      title,
      formula,
      query1,
      query2,
      x
    })

    console.log(widget)
    widgets.push(widget)
  })

  return widgets

}