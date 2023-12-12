module.exports = class HourlyCupsTemplate {
  data() {
    return {
      pagination: {
        data: 'beancounter.users',
        size: 1,
        alias: 'member',
        resolve: 'values',
      },
      permalink(data) {
        return `share/${this.hash(data.member.username)}/hourly-cups.json`
      },
    }
  }
  render(data) {
    const hourly = Array.from({ length: 24 }, () => 0)
    for (const record of data.member.cups) {
      const date = new Date(record.createdAt)
      hourly[date.getHours()] += record.quantity
    }
    return JSON.stringify(hourly, null, 2)
  }
}
