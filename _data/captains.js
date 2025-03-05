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

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const timeFormat = new Intl.DateTimeFormat('en-GB', {
  dateStyle: undefined,
  timeStyle: 'short',
})

const BUCKET_MINS = 30

module.exports = function () {
  //
  // Bucket all records per slot
  //
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

  //
  // Work out the captain for each bucket
  //
  const captains = new Map()
  for (const [key, records] of daily) {
    const [highest] = Object.entries(groupBy(records, (r) => r.username))
      .map(([username, records]) => ({
        username,
        quantity: records.reduce((map, r) => map + r.quantity, 0),
      }))
      .sort((a, b) => b.quantity - a.quantity)

    captains.set(key, highest)
  }
  console.log('perMember', captains)

  // NOTE: the year doesn't matter here, its just used as a base to work out
  // days of week and do the slots

  const dayBase = new Date('2023-12-11T00:00:00')

  const dayStart = getKey(new Date('2023-12-11T07:00:00'), BUCKET_MINS)
  const dayEnd = getKey(new Date('2023-12-11T19:00:00'), BUCKET_MINS)
  const daySlots = (24 * 60) / BUCKET_MINS

  console.log({ dayStart, dayEnd, dayMins: daySlots })

  const table = []
  for (let dayOfWeek = 0; dayOfWeek < 5; dayOfWeek++) {
    let values = []
    for (let key = dayStart; key <= dayEnd; key++) {
      values.push(captains.get(key + dayOfWeek * daySlots) ?? null)
    }

    table.push({ heading: daysOfWeek[dayOfWeek + 1], values })
  }

  const slots = []
  for (let key = dayStart; key <= dayEnd; key++) {
    const date = new Date(dayBase)
    date.setMinutes(key * BUCKET_MINS)
    console.log(key, date)
    slots.push(timeFormat.format(date))
  }

  return {
    raw: Object.fromEntries(captains),
    table,
    slots,
  }
}
