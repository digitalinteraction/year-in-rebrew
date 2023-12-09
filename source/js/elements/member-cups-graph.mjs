import { Chart, shortMonths } from '../lib/chart.mjs'

export class MemberCupsGraph extends HTMLElement {
  static define() {
    customElements.define('member-cups-graph', this)
  }
  connectedCallback() {
    this.canvas = document.createElement('canvas')
    this.appendChild(this.canvas)

    this.setup()
  }

  async setup() {
    const data = await fetch('./member.json').then((r) => r.json())

    const monthly = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (const record of data.cups) {
      const date = new Date(record.createdAt)
      monthly[date.getMonth()] += record.quantity
    }

    const color = getComputedStyle(document.body).getPropertyValue('--color')
    const highlight = getComputedStyle(document.body).getPropertyValue(
      '--highlight',
    )

    this.chart = new Chart(this.canvas, {
      type: 'line',
      data: {
        labels: shortMonths,
        datasets: [
          {
            label: 'Cups of coffee',
            data: monthly,
          },
        ],
      },
      options: {
        color: color,
        borderColor: color,
        backgroundColor: highlight,
        tension: 0.4,
        pointStyle: false,
        borderWidth: 5,
        plugins: {
          legend: false,
        },
      },
    })
  }
}
