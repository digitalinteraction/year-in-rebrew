module.exports = class HourlyCupsTemplate {
  data() {
    return {
      permalink: '/hourly-cups.json',
    }
  }
  render(data) {
    const hourly = Array.from({ length: 24 }, () => 0)
    for (const member of Object.values(data.beancounter.users)) {
      for (const record of member.cups) {
        const date = new Date(record.createdAt)
        hourly[date.getHours()] += record.quantity
      }
    }
    return JSON.stringify(hourly, null, 2)
  }
}
