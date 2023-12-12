import { Chart } from '../lib/chart.mjs'

export class HourlyRadar extends HTMLElement {
  static define() {
    customElements.define('hourly-radar', this)
  }
  connectedCallback() {
    this.canvas = document.createElement('canvas')
    this.appendChild(this.canvas)

    this.render()
  }

  async render() {
    const hourly = await fetch(this.getAttribute('endpoint'))
      .then((r) => r.json())
      .catch(() => null)

    if (!hourly) {
      console.error('<hourly-radar> failed to fetch data')
      return
    }

    const color = getComputedStyle(document.body).getPropertyValue('--color')
    const highlight = getComputedStyle(document.body).getPropertyValue(
      '--highlight',
    )

    // prettier-ignore
    const labels = [
      'Midnight', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am',
      'Noon', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm',
    ]

    const trim = (arr) => arr.slice(7, 20)

    this.chart = new Chart(this.canvas, {
      type: 'line',
      data: {
        labels: trim(labels),
        datasets: [
          {
            label: 'Cups of coffee',
            data: trim(hourly),
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
