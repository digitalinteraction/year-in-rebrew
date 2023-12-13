// https://danielgjackson.github.io/playground/fractions.html

const fractions1 = {
  '': 0,
}
const fractions2 = {
  '': 0,
  '½': 1 / 2,
}
const fractions3 = {
  '': 0,
  '⅓': 1 / 3,
  '⅔': 2 / 3,
}
const fractions4 = {
  '': 0,
  '¼': 1 / 4,
  '½': 2 / 4, // 1/2
  '¾': 3 / 4,
}
const fractions5 = {
  '': 0,
  '⅕': 1 / 5,
  '⅖': 2 / 5,
  '⅗': 3 / 5,
  '⅘': 4 / 5,
}
const fractions6 = {
  '': 0,
  '⅙': 1 / 6,
  '⅓': 2 / 6, // 1/3
  '½': 3 / 6, // 1/2
  '⅔': 4 / 6, // 2/3
  '⅚': 5 / 6,
}
const fractions8 = {
  '': 0,
  '⅛': 1 / 8,
  '¼': 2 / 8, // 1/4
  '⅜': 3 / 8,
  '½': 4 / 8, // 1/2
  '⅝': 5 / 8,
  '¾': 6 / 8, // 3/4
  '⅞': 7 / 8,
}
const fractions3and4 = {
  '': 0, // 0.000
  '¼': 1 / 4, // 0.250
  '⅓': 1 / 3, // 0.333
  '½': 1 / 2, // 0.500
  '⅔': 2 / 3, // 0.667
  '¾': 3 / 4, // 0.750
}
const fractions6and8 = {
  '': 0, // 0.000
  '⅛': 1 / 8, // 0.125
  '⅙': 1 / 6, // 0.167
  '¼': 1 / 4, // 0.250
  '⅓': 1 / 3, // 0.333
  '⅜': 3 / 8, // 0.375
  '½': 1 / 2, // 0.500
  '⅝': 5 / 8, // 0.625
  '⅔': 2 / 3, // 0.667
  '¾': 3 / 4, // 0.750
  '⅚': 5 / 6, // 0.833
  '⅞': 7 / 8, // 0.875
}

const fractionsDefaultStrategy = {
  1: fractions3and4,
  5: fractions3and4,
  10: fractions2,
  null: fractions1,
}

export function getFractional(number, strategy = fractionsDefaultStrategy) {
  let sign = number < 0 ? '-' : ''
  let whole = Math.trunc(Math.abs(number))
  const fractional = Math.abs(Math.abs(number) - whole)
  // Begin with round-down
  let nearest = ['', 0]
  let nearestValue = fractional
  let fractionString = ''
  for (const cutoff in strategy) {
    if (cutoff === null || Math.abs(number) <= cutoff) {
      for (const fraction of Object.entries(strategy[cutoff])) {
        if (
          nearest === null ||
          Math.abs(fractional - fraction[1]) < nearestValue
        ) {
          nearest = fraction
          nearestValue = Math.abs(fractional - fraction[1])
        }
      }
      break
    }
  }
  // Closer to round up?
  if (nearestValue > 1 - fractional) {
    whole += 1
    fractionString = ''
  } else {
    fractionString = nearest[0]
  }
  // Remove zero whole part if fractional part exists
  if (fractionString !== '' && whole === 0) {
    whole = ''
  }
  // Do not show -0 with no fractional part
  if (fractionString === '' && whole === 0) {
    sign = ''
  }
  // Format whole part
  if (whole !== '') {
    try {
      whole = Intl.NumberFormat().format(whole)
    } catch (e) {
      console.error(e)
    }
  }
  return `${sign}${whole}${fractionString}`
}
