import { NotACult } from './elements/not-a-cult.mjs'
import { CupsGraph } from './elements/cups-graph.mjs'
import { BeansGraph } from './elements/beans-graph.mjs'
import { HourlyGraph } from './elements/hourly-graph.mjs'
import { FunMetric } from './elements/fun-metric.mjs'

async function main() {
  NotACult.define()
  CupsGraph.define()
  BeansGraph.define()
  HourlyGraph.define()
  FunMetric.define()
}

main().catch((e) => console.error('Fatal', e))
