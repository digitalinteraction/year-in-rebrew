import {
  Chart,
  BarController,
  LineController,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  Legend,
  CategoryScale,
} from 'chart.js'

Chart.register(
  BarController,
  LineController,
  LineElement,
  BarElement,
  LinearScale,
  Legend,
  CategoryScale,
  PointElement,
)
Chart.defaults.font.family = 'Rubik, system-ui, sans-serif'
Chart.defaults.font.size = 16
// Chart.defaults.color = 'var(--color)'

export const shortMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export { Chart }
