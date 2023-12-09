const numberFormatter = new Intl.NumberFormat('en-GB', {})

const niceScales = [
  { name: 'two', value: 2 },
  { name: 'five', value: 5 },
  { name: 'ten', value: 10 },
  { name: 'twenty five', value: 25 },
  { name: 'fifty', value: 50 },
  { name: 'seventy five', value: 75 },
  { name: 'one hundred', value: 100 },

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
    return `${numberFormatter.format(scale.name)} ${plural(metric.name)} full`
  }
  return `${scale.name} of a ${metric.name} full`
}

//
// WEIGHT
//

const funWeights = {
  'can of pop': 0.343,
  corgi: 12.24699,
  dalmatian: 31.75147,
  "Terry's chocolate orange": 0.157,
}

/** @param {number} input */
export function getFunWeight(input) {
  const { metric, scale } = getFunMetric(input, funWeights)

  if (scale.value === 1) {
    return `the weight of a ${metric.name}`
  }
  if (scale.value > 1) {
    return `${scale.name}⨉ the weight of a ${metric.name}`
  }
  return `${scale.name} of the weight of a ${metric.name}`
}

//
// LENGTH
//

const funLengths = {
  pencil: 0.19,
  'can of pop': 0.11498,
  'lego brick': 0.0191,
}

/** @param {number} input */
export function getFunLength(input) {
  const { metric, scale } = getFunMetric(input, funLengths)

  if (scale.value === 1) {
    return `the length of a ${metric.name}`
  }
  if (scale.value > 1) {
    return `${numberFormatter.format(scale.name)} ${plural(metric.name)}`
  }
  return `${scale.name} the length of a ${metric.name}`
}

//
// COST
//

const funCosts = {
  starbucks: 3.85,
  costa: 3.7,
  downstairs: 4, // TODO: find actual value
}

/** @param {number} input */
export function getFunCost(input) {
  console.log(input)
  const starbucks = (funCosts.starbucks / input).toFixed(0)
  const costa = (funCosts.costa / input).toFixed(0)
  const downstairs = (funCosts.downstairs / input).toFixed(0)

  return `${starbucks}⨉ cheaper than starbucks, ${costa}⨉ than costa and ${downstairs}⨉ than downstairs`
}

/**
 * @param {number} input
 * @param {Record<string,number>} metric
 */
export function getFunMetric(input, targetMetric) {
  for (const scale of niceScales) {
    for (const metric of sortMetrics(targetMetric)) {
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

  const [metric] = sortMetrics(targetMetric).reverse()
  const scale = {
    name: (input / metric.value).toFixed(),
    value: input / metric.value,
  }
  return { metric, scale }
}
