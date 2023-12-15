import { watchColorScheme } from '../lib/dark-mode.mjs'

export class NemesisFrame extends HTMLElement {
  static define() {
    customElements.define('nemesis-frame', this)
  }

  /** @type {SVGElement | null} */
  static svg = null

  static async getSvg() {
    if (this.svg) return this.svg

    const text = await fetch('/assets/img/nemesis.svg').then((r) => r.text())

    this.svg = new DOMParser()
      .parseFromString(text, 'image/svg+xml')
      .querySelector('svg')

    if (!this.svg) {
      throw new Error('<nemesis-frame> Failed to load SVG')
    }

    return this.svg
  }

  connectedCallback() {
    watchColorScheme(() => this.render())
  }

  async render() {
    if (!this.svg) {
      const template = await NemesisFrame.getSvg()
      this.svg = template.cloneNode(true)
      this.appendChild(this.svg)
    }

    // patch the SVG based on headshot
    this.svg
      .querySelector('#headshot')
      .setAttribute('href', this.getAttribute('headshot'))
  }
}
