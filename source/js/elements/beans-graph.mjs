import { Chart, shortMonths } from '../lib/chart.mjs'

export class BeansGraph extends HTMLElement {
  static define() {
    customElements.define('beans-graph', this)
  }
  connectedCallback() {
    this.canvas = document.createElement('canvas')
    this.appendChild(this.canvas)

    this.render()
  }

  async render() {
    const monthly = await fetch(this.getAttribute('endpoint'))
      .then((r) => r.json())
      .catch(() => null)

    if (!monthly) {
      console.error('<cups-graph> failed to fetch data')
      return
    }

    const color = getComputedStyle(document.body).getPropertyValue('--color')
    const highlight = getComputedStyle(document.body).getPropertyValue(
      '--highlight',
    )

    this.chart = new Chart(this.canvas, {
      type: 'bar',
      data: {
        labels: shortMonths,
        datasets: [
          {
            label: 'Beans purchased',
            data: monthly,
            backgroundColor: color,
            borderRadius: 4,
          },
        ],
      },
      options: {
        color: color,
        borderColor: color,
        backgroundColor: highlight,
        tension: 0.4,
        pointStyle: false,
        borderWidth: 0,
        plugins: {
          legend: false,
        },
      },
    })
  }
}