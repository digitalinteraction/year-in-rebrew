import { CupsGraph } from './js/cups-graph.mjs'

async function main() {
  CupsGraph.define()
}

main().catch((e) => console.error('Fatal', e))
