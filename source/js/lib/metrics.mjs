import { getFractional } from './fractions.mjs'

const scaleFormatter = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 0,
})

const niceScales = [
  { name: 'one', value: 1 },
  { name: '1/2', value: 0.5 },
  { name: '1/3', value: 1 / 3 },
  { name: '2/3', value: 2 / 3 },
  { name: '1/4', value: 0.25 },
  { name: '3/4', value: 0.75 },
]

/** @param {string} input */
function plural(input) {
  if (input.endsWith('us')) return input.replace(/us$/, 'ii')
  if (input.endsWith('s')) return input + 'es'
  return input + 's'
}

function almostEqual(a, b, t = 0.1) {
  return a > b * (1 - t) && a < b * (1 + t)
}

/** @param {Record<string, number>} metrics */
function sortMetrics(metrics) {
  return Object.entries(metrics)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => a.value - b.value)
}

//
// VOLUME
//

const funVolumes = {
  'pint glass': 0.5682612,
  'bath tub': 300,
  bucket: 18.18,
  barrel: 117.347844,
}

/** @param {number} input */
export function getFunVolume(input) {
  const { metric, scale } = getFunMetric(input, funVolumes)

  if (scale.value === 1) {
    return `a ${metric.name}`
  }
  if (scale.value > 1) {
    return `${scaleFormatter.format(scale.value)} ${plural(metric.name)} full`
  }
  return `${scale.name} of a ${metric.name} full`
}

//
// WEIGHT
//

const funWeights = {
  'garden gnome': 0.309,
  'MacBook Pro': 1.83,
  'bowling ball': 5,
  'studio display': 6.3,
  corgi: 12.24699,
  Yoda: 13,
  dalmatian: 31.75147,
}

/** @param {number} input */
export function getFunWeight(input) {
  const { metric, scale } = getFunMetric(input, funWeights)

  if (scale.value === 1) {
    return `the weight of a ${metric.name}`
  }
  if (scale.value > 1) {
    return `${scale.name} × the weight of a ${metric.name}`
  }
  const msg = `${scale.name} of the weight of a ${metric.name}`
  console.log(scale, metric, msg)
  return msg
}

//
// LENGTH
//

const funLengths = {
  human: 1.7,
  cow: 2.45,
  pencil: 0.19,
  'blue whale': 29.9,
  "Hadrian's Tower": 82,
}

/** @param {number} input */
export function getFunLength(input) {
  const { metric, scale } = getFunMetric(input, funLengths)

  if (scale.value === 1) {
    return `the length of a ${metric.name}`
  }
  if (scale.value > 1) {
    return `the length of ${scaleFormatter.format(scale.value)} ${plural(
      metric.name,
    )}`
  }
  return `${scale.name} the length of a ${metric.name}`
}

//
// COST
//

const funCosts = {
  starbucks: 3.85,
  costa: 3.2,
  downstairs: 2.1,
}

/** @param {number} input */
export function getFunCost(input) {
  // const starbucks = (funCosts.starbucks / input).toFixed(0)
  const costa = (funCosts.costa / input).toFixed(0)
  const downstairs = (funCosts.downstairs / input).toFixed(0)

  return `${downstairs} × cheaper than downstairs, through the year it would have cost you £${costa} at Costa`
}

export function getFunMetric(input, targetMetric) {
  // getFractional
  const [metric] = sortMetrics(targetMetric).sort(
    (a, b) => Math.abs(a.value - input) - Math.abs(b.value - input),
  )

  const value = input / metric.value

  return {
    metric,
    scale: {
      name: getFractional(value),
      value,
    },
  }
}

/**
 * @param {number} input
 * @param {Record<string,number>} metric
 */
export function xgetFunMetric(input, targetMetric) {
  const metrics = sortMetrics(targetMetric)
  for (const scale of niceScales) {
    for (const metric of metrics) {
      if (almostEqual(input, metric.value * scale.value)) {
        console.debug(
          'getFunMetric %s=%f value=%f',
          metric.name,
          metric.value,
          metric.value * scale.value,
        )
        return { metric, scale }
      }
    }
  }

  const [metric] = metrics
    .map((m) => ({ ...m, distance: Math.abs(m.value - input) }))
    .sort((a, b) => a.distance - b.distance)

  const scale = {
    name: (input / metric.value).toFixed(0),
    value: input / metric.value,
  }
  return { metric, scale }
}
