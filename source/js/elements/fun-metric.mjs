import {
  getFunLength,
  getFunVolume,
  getFunWeight,
  getFunCost,
} from '../lib/metrics.mjs'

// NOTE: I'd much rather this be baked into the 11ty build
//       but it doesn't support ESM at time of writing
export class FunMetric extends HTMLElement {
  static define() {
    customElements.define('fun-metric', this)
  }
  static metricMapping = {
    volume: getFunVolume,
    weight: getFunWeight,
    length: getFunLength,
    cost: getFunCost,
  }

  connectedCallback() {
    const type = this.getAttribute('type')
    const rawValue = this.getAttribute('value')
    const value = typeof rawValue === 'string' ? parseFloat(rawValue) : null

    const calculator = type ? FunMetric.metricMapping[type] : null

    if (!calculator) {
      this.textContent = `Error: unknown type "${type}"`
      return
    }
    if (Number.isNaN(value)) {
      this.textContent = `Error: invalid number "${type}"`
      return
    }

    this.textContent = calculator(value)
  }
}
