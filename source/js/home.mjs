import { NotACult } from './elements/not-a-cult.mjs'
import { CupsGraph } from './elements/cups-graph.mjs'
import { BeansGraph } from './elements/beans-graph.mjs'
import { HourlyGraph } from './elements/hourly-graph.mjs'
import { FunMetric } from './elements/fun-metric.mjs'
import { ComradeFrame } from './elements/comrade-frame.mjs'
import { CoffeeSection } from './elements/coffee-section.mjs'

function setCaptain(value) {
  for (const elem of document.querySelectorAll('table.captains td')) {
    elem.classList.toggle('current', elem.querySelector('img')?.alt === value)
  }
}

async function main() {
  BeansGraph.define()
  CoffeeSection.define()
  ComradeFrame.define()
  CupsGraph.define()
  FunMetric.define()
  HourlyGraph.define()
  NotACult.define()

  for (const elem of document.querySelectorAll('table.captains td img')) {
    elem.addEventListener('click', () => {
      setCaptain(elem.alt ?? null)
    })
  }
}

main().catch((e) => console.error('Fatal', e))
