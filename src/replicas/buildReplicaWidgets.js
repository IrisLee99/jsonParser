import parse from "json-templates"

import replica from '../templates/replicas/replica.json' assert { type: 'json'}

const replicaTemplate = parse(replica)

export default function buildLoadWidgets ({}) {

  const titles = ['Replicas Available', 'Desired', 'Unavailable']
  const comparators1 = ['>', '>=', '<=']
  const comparators2 = ['<', '<', '>']
  const replicaTypes = ['replicas_available', 'replicas_desired', 'replicas_unavailable']
  const width = [2,1,1]
  const x = [0,0,1]
  const y = [0,1,1]

    let widgets = []
    titles.forEach((title, index) => {

     const widget =  replicaTemplate({
      title,
      comparator1: comparators1[index],
      comparator2: comparators2[index],
      replicaType: replicaTypes[index],
      width: width[index],
      x: x[index],
      y: y[index]
    })

    widgets.push(widget)
    })  

    return widgets.flat()

}