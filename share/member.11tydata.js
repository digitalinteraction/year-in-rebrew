const beancounter = require('../_data/beancounter.json')

/** 
  @typedef {object} Record
  @property {string} createdAt
  @property {number} quantity
*/

/**
  @param {Date} input
  @param {Date} reference
 */
function getDaysSince(input, reference) {
  return Math.floor(
    (input.getTime() - reference.getTime()) / 1000 / 60 / 60 / 24,
  )
}

function findPeers(member) {
  const activeDays = new Map()
  const startOfYear = new Date('2023-01-01')
  for (const record of member.cups) {
    const key = getDaysSince(new Date(record.createdAt), startOfYear)
    activeDays.set(key, (activeDays.get(key) ?? []).concat([record]))
  }
  // console.log(activeDays)

  const perDay = new Map([...activeDays.keys()].map((d) => [d, []]))
  for (const user of Object.values(beancounter.users)) {
    for (const record of user.cups) {
      const day = getDaysSince(new Date(record.createdAt), startOfYear)
      perDay.get(day)?.push({ ...record, username: user.username })
    }
  }

  // const goodies = new Map()
  // const baddies = new Map()
  const goodies = new Map()
  const baddies = new Map()

  for (const records of perDay.values()) {
    // const { member, others } = groupBy(records, (r) =>
    //   r.username === member.username ? 'member' : 'not',
    // )
    // const memberTimes = member.map(r => new Date(r.createdAt))

    // const good = new Set()
    // const bad = new Set()

    const { [member.username]: memberRecords, ...otherRecords } = groupBy(
      records,
      (r) => r.username,
    )

    for (const [username, records] of Object.entries(otherRecords)) {
      let friend = false
      for (const record of records) {
        if (isFriend(record, memberRecords)) {
          friend = true
          increment(goodies, username)
        }
      }
      if (!friend) increment(baddies, username)
    }

    // const memberTimes = records
    //   .filter((r) => r.username === member.username)
    //   .map((r) => new Date(r.createdAt))

    // const {good,bad} = groupBy(others, r => {
    //   const date = new Date(r.createdAt)
    // })
  }

  //   for (const [day, memberRecords] of perDay.entries()) {
  //     const things = perDay
  //       .get(day)
  //       .filter((r) => r.username !== member.username)
  //       .map((record) => ({ record, ...getMinMax(record, memberRecords) }))
  //       .filter((r) => r.max > 0 && r.min < Infinity)
  //
  //     const [goodie] = [...things].sort((a, b) => b.min - a.min)
  //     const [baddie] = [...things].sort((a, b) => a.max - b.max)
  //
  //     if (goodie) increment(goodies, goodie.record.username)
  //     if (baddie) increment(baddies, baddie.record.username)
  //   }

  // if (member.username === 'rob-anderson') {
  //   // console.log(buckets)
  //   // console.log('goodies', goodies)
  // }

  // const output = Array.from(goodies.entries())
  //   .map(([username, sharedCoffees]) => ({ username, sharedCoffees }))
  //   .sort((a, b) => b.sharedCoffees - a.sharedCoffees)

  // console.log(member.username, baddies)

  return {
    goodies: sortedNumberMap(goodies),
    baddies: sortedNumberMap(baddies),
  }
}

function sortedNumberMap(map) {
  return Array.from(map.entries())
    .map(([username, value]) => ({ username, value }))
    .sort((a, b) => b.value - a.value)
}

function isFriend(record, target) {
  const d1 = new Date(record.createdAt)
  for (const other of target) {
    const d2 = new Date(other.createdAt)
    if (Math.abs(d1.getTime() - d2.getTime()) < GOODIE_THRESHOLD) {
      return true
    }
  }
  return false
}

function groupBy(input, predicate) {
  const record = {}
  for (const item of input) {
    const result = predicate(item)
    if (record[result]) record[result].push(item)
    else record[result] = [item]
  }
  return record
}

function increment(map, key, value = 1) {
  const current = map.get(key) || 0
  map.set(key, current + value)
}

const GOODIE_THRESHOLD = 30 * 60 * 1_000
const BADDIE_THRESHOLD = 2 * 60 * 60 * 1_000

/**
  @param {Record} record
  @param {Record[]} targets
 */
function getMinMax(record, targets) {
  let min = Infinity
  let max = 0
  const date = new Date(record.createdAt)

  for (const target of targets) {
    if (record.username === target.username) continue

    const other = new Date(target.createdAt)
    const distance = Math.abs(date.getTime() - other.getTime())

    if (distance < GOODIE_THRESHOLD && distance < min) min = distance
    if (distance > BADDIE_THRESHOLD && distance > max) max = distance
  }

  return { min, max }
}

module.exports = {
  eleventyComputed: {
    peers: (data) => {
      return findPeers(data.member)
    },
  },
}
