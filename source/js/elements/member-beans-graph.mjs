import { Chart, shortMonths } from '../lib/chart.mjs'

export class MemberBeansGraph extends HTMLElement {
  static define() {
    customElements.define('member-beans-graph', this)
  }
  connectedCallback() {
    this.canvas = document.createElement('canvas')
    this.appendChild(this.canvas)

    this.setup()
  }

  async setup() {
    const data = await fetch('./member.json').then((r) => r.json())

    const monthly = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (const record of data.beans) {
      const date = new Date(record.createdAt)
      monthly[date.getMonth()] += record.quantity / 1000
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
