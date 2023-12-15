import { watchColorScheme } from '../lib/dark-mode.mjs'

export class ComradeFrame extends HTMLElement {
  static define() {
    customElements.define('comrade-frame', this)
  }

  /** @type {SVGElement | null} */
  static svg = null

  static async getSvg() {
    if (this.svg) return this.svg

    const text = await fetch('/assets/img/comrade.svg').then((r) => r.text())

    this.svg = new DOMParser()
      .parseFromString(text, 'image/svg+xml')
      .querySelector('svg')

    if (!this.svg) {
      throw new Error('<comrade-frame> Failed to load SVG')
    }

    return this.svg
  }

  connectedCallback() {
    watchColorScheme(() => this.render())
  }

  async render() {
    if (!this.svg) {
      const template = await ComradeFrame.getSvg()
      this.svg = template.cloneNode(true)
      this.appendChild(this.svg)
    }

    // patch the SVG based on headshot
    if (this.hasAttribute('first')) {
      this.svg
        .querySelector('#headshot-a')
        .setAttribute('href', this.getAttribute('first'))
    }
    if (this.hasAttribute('second')) {
      this.svg
        .querySelector('#headshot-b')
        .setAttribute('href', this.getAttribute('second'))
    }
  }
}
