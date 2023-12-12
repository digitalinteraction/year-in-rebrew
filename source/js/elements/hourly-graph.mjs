import { Chart } from '../lib/chart.mjs'
import { watchColorScheme } from '../lib/dark-mode.mjs'

export class HourlyGraph extends HTMLElement {
  static define() {
    customElements.define('hourly-graph', this)
  }
  connectedCallback() {
    this.canvas = document.createElement('canvas')
    this.appendChild(this.canvas)

    watchColorScheme(() => this.render())
  }

  getChartOptions() {
    const color = getComputedStyle(document.body).getPropertyValue('--color')

    return {
      color: color,
      borderColor: color,
      tension: 0.4,
      pointStyle: false,
      borderWidth: 5,
      plugins: {
        legend: false,
      },
    }
  }

  async render() {
    const hourly = await fetch(this.getAttribute('endpoint'))
      .then((r) => r.json())
      .catch(() => null)

    if (!hourly) {
      console.error('<hourly-graph> failed to fetch data')
      return
    }

    // prettier-ignore
    const labels = [
      'Midnight', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am',
      'Noon', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm',
    ]

    const trim = (arr) => arr.slice(7, 20)

    if (this.chart) {
      this.chart.options = this.getChartOptions()
      this.chart.update()
    } else {
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
        options: this.getChartOptions(),
      })
    }
  }
}
