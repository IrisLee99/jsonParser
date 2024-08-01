import parse from "json-templates"

import load from "../templates/replicas/load.json" assert { type: "json" }
import buildReplicaLoadCurrentWidgets from './buildLoadCurrentWidgets.js'

const loadTemplate = parse(load)

export default function buildLoadWidgets ({ titles, types }) {

  let replicaLoadCurrentWidgets
  let formula, query1, query2, x
  let widgets = []
  titles.forEach( title => {
    let prefix, midfix = '', group

    if (title.startsWith('CPU')) {
      formula = '(query1 / 1000000000) * 100 / query2'      
      prefix = 'avg'
      midfix = '.total'
      group = 'cpu'
      x = 2
      replicaLoadCurrentWidgets = buildReplicaLoadCurrentWidgets({ group, types })

    } else if (title.startsWith('Memory')) {
      formula = 'query1 * 100 / query2'
      prefix = 'sum'
      group = 'memory'
      x = 7
      replicaLoadCurrentWidgets = buildReplicaLoadCurrentWidgets({ group, types })
    }

    query1 = `${prefix}:kubernetes.${group}.usage${midfix}{$kube-service}`
    query2 = `${prefix}:kubernetes.${group}.requests{$kube-service}`

    const widget =  loadTemplate({
      title,
      formula,
      query1,
      query2,
      x
    })

    console.log(widget)
    widgets.push(widget)
    widgets.push(replicaLoadCurrentWidgets)
  })

  return widgets.flat()

}