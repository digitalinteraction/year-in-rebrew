require('dotenv/config')
const { createHmac } = require('node:crypto')
const fs = require('node:fs')

const eleventyWebc = require('@11ty/eleventy-plugin-webc')
const { eleventyAlembic } = require('@openlab/alembic/11ty')

const { URL_HASH_SECRET = 'top_secret' } = process.env

const beancounter = require('./_data/beancounter.json')

function hash(value) {
  return createHmac('sha256', URL_HASH_SECRET).update(value).digest('base64url')
}

const cupsFormat = new Intl.NumberFormat('en-GB', {
  notation: 'standard',
  maximumFractionDigits: 2,
})
const beansFormat = new Intl.NumberFormat('en-GB', {
  maximumSignificantDigits: 3,
  style: 'unit',
  unit: 'kilogram',
})
const costFormat = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
})

const daysIn2024 = [, 53, 53, 52, 52, 52]

function formatCups(cups) {
  return cupsFormat.format(cups) + (cups === 1 ? ' cup' : ' cups')
}
function formatBeans(grams) {
  return beansFormat.format(grams)
}
function formatCost(pounds) {
  return costFormat.format(pounds)
}
function dailyAverage(records, dayOfWeek) {
  const sum = records
    .filter((r) => new Date(r.createdAt).getDay() === dayOfWeek)
    .reduce((sum, r) => sum + r.quantity, 0)
  return sum / daysIn2024[dayOfWeek]
}
function demember(value, key) {
  const result = []
  for (const member of Object.values(value)) result.push(...member[key])
  return result
}
function activeMembers(users) {
  const output = {}
  for (const [key, value] of Object.entries(users)) {
    if (value.cups.length > 0 || value.beans.length > 0) {
      output[key] = value
    }
  }
  return output
}
function unslug(input) {
  return input
    .replace(/-/g, ' ')
    .split(/\s+/)
    .map((word) => word.slice(0, 1).toLocaleUpperCase() + word.slice(1))
    .join(' ')
}
function template(input, ...values) {
  let output = input
  for (let i = 0; i < values.length; i++) {
    output = input.replace('$' + (i + 1), values[i])
  }
  return output
}

/** @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig */
module.exports = function (eleventyConfig) {
  eleventyConfig.setQuietMode(true)

  eleventyConfig.addWatchTarget('source')

  eleventyConfig.addPlugin(eleventyWebc)
  eleventyConfig.addPlugin(eleventyAlembic, { useLabcoat: true })

  eleventyConfig.addPassthroughCopy('assets')

  eleventyConfig.addFilter('json', (value) => JSON.stringify(value, null, 2))
  eleventyConfig.addFilter('hash', (value) => hash(value))
  eleventyConfig.addFilter('sumRecords', (v) =>
    v.reduce((sum, record) => sum + record.quantity, 0),
  )
  eleventyConfig.addFilter('formatCups', (v) => formatCups(v))
  eleventyConfig.addFilter('formatBeans', (v) => formatBeans(v))
  eleventyConfig.addFilter('formatCost', (v) => formatCost(v))
  eleventyConfig.addFilter('dailyAverage', (v, d) => dailyAverage(v, d))

  eleventyConfig.addFilter('keys', (v) => Object.keys(v))
  eleventyConfig.addFilter('map', (v, map) =>
    v.map((i) => map[i]).filter((i) => i),
  )

  eleventyConfig.addFilter('demember', demember)
  eleventyConfig.addFilter('activeMembers', activeMembers)
  eleventyConfig.addFilter('unslug', unslug)
  eleventyConfig.addFilter('template', template)

  eleventyConfig.on('eleventy.after', () => {
    const file = fs.createWriteStream('members.csv')
    file.write('username,hash\n')
    for (const member of Object.values(beancounter.users)) {
      file.write(member.username + ',' + hash(member.username) + '\n')
    }
    file.close()
  })
  eleventyConfig.setServerOptions({ domDiff: false })
}
