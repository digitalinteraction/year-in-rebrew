/**
 * @typedef {object} Metric
 * @property {string} name
 * @property {number} value
 */

const niceFractions = [
  { name: 'one', value: 1 },
  { name: '1/2', value: 0.5 },
  { name: '1/3', value: 1 / 3 },
  { name: '2/3', value: 2 / 3 },
  { name: '1/4', value: 0.25 },
  { name: '3/4', value: 0.75 },
]

const niceScales = [
  { name: 'two', value: 2 },
  { name: 'five', value: 5 },
  { name: 'ten', value: 10 },
  { name: 'twenty five', value: 25 },
  { name: 'fifty', value: 50 },
  { name: 'seventy five', value: 75 },
  { name: 'one hundred', value: 100 },
]

const funCosts = {
  starbucks: 3.85,
  costa: 3.7,
  eatAtUrban: 4, // TODO: find actual value
}

const funVolumes = {
  'pint glass': 0.5682612,
  'bath tub': 300,
  bucket: 18.18,
  barrel: 41,
}

const funWeights = {
  'can of pop': 0.343,
  corgi: 12.24699,
  dalmatian: 31.75147,
}

const funLengths = {
  'can of pop': 0.11498,
  'lego 2x2 brick': 0.00955,
}

/** @param {string} input */
function plural(input) {
  if (input.endsWith('us')) return input.replace(/us$/, 'ii')
  if (input.endsWith('s')) return input + 'es'
  return input + 's'
}

function almostEqual(a, b, t = 0.5) {
  return a > b - t && a < b + t
}

/** @param {Record<string,number>} metrics */
function sortMetrics(metrics) {
  return Object.entries(metrics)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => a.value - b.value)
}

/**
 * @param {Metric} metric
 * @param {Metric} fraction
 */
function doFunny(metricName, fractionName, pluralise = false) {
  if (fractionName === 'one') return `one ${metricName}`
  return pluralise
    ? `${fractionName} ${plural(metricName)}`
    : `${fractionName} of a ${metricName}`
}

/** @param {number} input */
export function getFunVolume(input) {
  return doMetric(input, funVolumes)
}

/** @param {number} input */
export function getFunWeight(input) {
  return doMetric(input, funWeights)
}

/** @param {number} input */
export function getFunLength(input) {
  return doMetric(input, funLengths)
}

/** @param {number} input */
export function getFunCost(input) {
  return doMetric(input, funCosts)
}

/**
 * @param {number} input
 * @param {Record<string,number>} metric
 */
export function doMetric(input, targetMetric) {
  console.debug('metric', input)

  for (const scale of niceScales) {
    for (const metric of sortMetrics(targetMetric)) {
      console.debug('-', metric.name, scale.name, metric.value * scale.value)
      if (almostEqual(input, metric.value * scale.value)) {
        return doFunny(metric.name, scale.name, true)
      }
    }
  }

  for (const fraction of niceFractions) {
    for (const metric of sortMetrics(targetMetric)) {
      console.debug(
        '-',
        metric.name,
        fraction.name,
        metric.value * fraction.value,
      )
      if (almostEqual(input, metric.value * fraction.value)) {
        return doFunny(metric.name, fraction.name, true)
      }
    }
  }

  for (let i = 0; i < 1000; i++) {
    for (const metric of sortMetrics(targetMetric)) {
      console.debug('-', metric.name, `${i}`, metric.value * i)
      if (almostEqual(input, metric.value * i)) {
        return doFunny(metric.name, `${i}`, true)
      }
    }
  }
}
