import { UsagePlanet } from './elements/usage-planet.mjs'

async function main() {
  UsagePlanet.define()
}

main().catch((e) => console.error('Fatal', e))
