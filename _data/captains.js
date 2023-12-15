const fs = require('node:fs/promises')
const eleventyFetch = require('@11ty/eleventy-fetch')
const sharp = require('sharp')
const config = require('./config.json')
const beancounter = require('./beancounter.json')

/** @param {Date} date */
function getKey(date, bucketMins) {
  const minutes =
    date.getDay() * 24 * 60 + date.getHours() * 60 + date.getMinutes()
  return Math.floor(minutes / bucketMins)
}

// https://github.com/tc39/proposal-upsert
function emplace(map, key, operation = {}) {
  const value = map.get(key)

  map.set(
    key,
    value === undefined
      ? operation.insert?.(key, map)
      : operation.update?.(value, key, map),
  )

  // if (value === undefined) operation.insert?.(key, map)
  // else map.set(key, operation.update?.(value, key, map))
}

// this is copy-pasted from member.11tydata.js
function groupBy(input, predicate) {
  const record = {}
  for (const item of input) {
    const result = predicate(item)
    if (record[result]) record[result].push(item)
    else record[result] = [item]
  }
  return record
}

const BUCKET_MINS = 30

module.exports = function () {
  const daily = new Map()
  for (const member of Object.values(beancounter.users)) {
    const username = member.username
    for (const record of member.cups) {
      const date = new Date(record.createdAt)
      emplace(daily, getKey(date, BUCKET_MINS), {
        insert: () => [{ username, ...record }],
        update: (arr) => arr.concat([{ username, ...record }]),
      })
    }
  }
  console.log('daily', daily)

  const perMember = new Map()
  for (const [key, records] of daily) {
    perMember.set(
      key,
      groupBy(records, (r) => r.username),
    )
  }
  console.log('perMember', perMember)

  // TODO: this doesn't work

  const totals = new Map()
  for (const [key, members] of perMember) {
    const [highest] = Object.values(members).sort((a, b) => a.length - b.length)

    totals.set(key, highest)
  }
  console.log('totals', totals)
}
