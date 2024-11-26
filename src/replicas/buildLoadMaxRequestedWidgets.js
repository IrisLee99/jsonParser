import parse from "json-templates";

import loadCurrentMaxPc from "../templates/replicas/loadCurrentMaxPc.json" assert { type: "json" };
import loadCurrent from "../templates/replicas/loadCurrent.json" assert { type: "json" };

export default function buildLoadMaxRequestedWidgets({
  group,
  types,
  query1,
  query2,
}) {
  // query1 = 'sum:kubernetes.cpu.usage.total{$kube-deployment,$kube-service}'
  // query2 = 'sum:kubernetes.cpu.requests{$kube-deployment,$kube-service}'

  // query1 = 'sum:kubernetes.memory.usage{$kube-service}'
  // query2 = 'sum:kubernetes.memory.requests{$kube-service}'

  // types = ['max', 'requested']

  let loadCurrentTemplate;
  let title, formula, x;
  let widgets = [];

  if (group === "cpu") {
    types.forEach((type) => {
      title = type;
      if (type === "Max") {
        console.log("MAX - cpu");
        loadCurrentTemplate = parse(loadCurrentMaxPc);
        formula = "(query1 / 1000000000) * 100 / query2";
        const midfix = group === "cpu" ? ".total" : "";
        query1 = `sum:kubernetes.${group}.usage${midfix}{$kube-deployment,$kube-service}`;
        query2 = `sum:kubernetes.${group}.requests{$kube-deployment,$kube-service}`;
        x = 5;
      } else if (type === "Requested") {
        loadCurrentTemplate = parse(loadCurrent);
        title = "Requested";
        console.log("Requested - cpu");
        formula = "query1";
        const midfix = group === "cpu" ? ".total" : "";
        query1 = `avg:kubernetes.${group}.requests{$kube-service}`;
        x = 6;
      }

      const widget = loadCurrentTemplate({
        title,
        formula,
        query1,
        query2,
        aggregator1: "max",
        aggregator2: "max",
        x,
        y: 1,
      });

      widgets.push(widget);
    });
  } else if (group === "memory") {
    types.forEach((type) => {
      title = type;
      if (type === "Max") {
        console.log("MAX - memory");
        loadCurrentTemplate = parse(loadCurrentMaxPc);
        formula = "query1 * 100 / query2";
        const midfix = group === "cpu" ? ".total" : "";
        query1 = `sum:kubernetes.${group}.usage${midfix}{$kube-service}`;
        query2 = `sum:kubernetes.${group}.requests${midfix}{$kube-service}`;
        x = 10;
      } else if (type === "Requested") {
        loadCurrentTemplate = parse(loadCurrent);
        console.log("Requested - memory");
        formula = "query1";
        const midfix = group === "cpu" ? ".total" : "";
        query1 = `avg:kubernetes.${group}.requests${midfix}{$kube-service}`;
        x = 11;
      }

      const widget = loadCurrentTemplate({
        title,
        formula,
        query1,
        query2,
        aggregator1: "max",
        aggregator2: "max",
        x,
        y: 1,
      });

      widgets.push(widget);
    });
  }

  return widgets;
}
