import { CupsGraph } from './js/cups-graph.mjs'

const pageUrl = new URL(location.href)

async function main() {
  CupsGraph.define()

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
