import { BeansGraph } from './elements/beans-graph.mjs'
import { CoffeeSection } from './elements/coffee-section.mjs'
import { ComradeFrame } from './elements/comrade-frame.mjs'
import { CupsGraph } from './elements/cups-graph.mjs'
import { FunMetric } from './elements/fun-metric.mjs'
import { HourlyGraph } from './elements/hourly-graph.mjs'
import { NemesisFrame } from './elements/nemesis-frame.mjs'
import { UsagePlanet } from './elements/usage-planet.mjs'

const pageUrl = new URL(location.href)

async function main() {
  BeansGraph.define()
  CoffeeSection.define()
  ComradeFrame.define()
  CupsGraph.define()
  FunMetric.define()
  HourlyGraph.define()
  NemesisFrame.define()
  UsagePlanet.define()

  const { username, beans, cups } = await fetch('./member.json').then((r) =>
    r.json(),
  )

  const totalCups = cups.reduce((sum, record) => sum + record.quantity, 0)
  const totalBeans = beans.reduce((sum, record) => sum + record.quantity, 0)

  if (pageUrl.searchParams.has('dev')) {
    const elem = document.getElementById('data')
    elem.removeAttribute('aria-hidden')
    elem.innerText = JSON.stringify(
      { username, totalCups, totalBeans, beans, cups },
      null,
      2,
    )
  }
}

main().catch((e) => console.error('Fatal', e))
