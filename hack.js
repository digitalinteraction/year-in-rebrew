const process = require('node:process')

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const commands = {
  days_of_week(year = '2024') {
    year = parseInt(year, 10)

    const start = new Date(`${year}-01-01`)
    const end = new Date(`${year + 1}-01-01`)

    function bump(date, n = 1) {
      const result = new Date(date)
      result.setDate(result.getDate() + n)
      return result
    }

    const buckets = [0, 0, 0, 0, 0, 0, 0]

    for (
      let date = new Date(start);
      date.getTime() < end.getTime();
      date = bump(date, 1)
    ) {
      buckets[date.getDay()]++
    }
    console.log(Object.fromEntries(buckets.map((v, i) => [daysOfWeek[i], v])))
  },
}

const cmd = commands[process.argv[2]]
if (!cmd) {
  console.log('Command not found: ' + process.argv[2])
  console.log('commands', Object.keys(commands))
  process.exit(1)
} else cmd(...process.argv.slice(3))
