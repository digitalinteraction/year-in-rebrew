import { Chart, shortMonths } from '../lib/chart.mjs'
import { watchColorScheme } from '../lib/dark-mode.mjs'

export class BeansGraph extends HTMLElement {
  static define() {
    customElements.define('beans-graph', this)
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
      backgroundColor: color,
      tension: 0.4,
      pointStyle: false,
      borderWidth: 0,
      plugins: {
        legend: false,
      },
    }
  }

  async render() {
    const monthly = await fetch(this.getAttribute('endpoint'))
      .then((r) => r.json())
      .catch(() => null)

    if (!monthly) {
      console.error('<beans-graph> failed to fetch data')
      return
    }

    if (this.chart) {
      this.chart.options = this.getChartOptions()
      this.chart.update()
    } else {
      this.chart = new Chart(this.canvas, {
        type: 'bar',
        data: {
          labels: shortMonths,
          datasets: [
            {
              label: 'Beans purchased',
              data: monthly,
              borderRadius: 4,
            },
          ],
        },
        options: this.getChartOptions(),
      })
    }
  }
}
