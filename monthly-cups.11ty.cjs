module.exports = class MonthlyCupsTemplate {
  data() {
    return {
      permalink: '/monthly-cups.json',
    }
  }
  render(data) {
    const monthly = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (const member of Object.values(data.beancounter.users)) {
      for (const record of member.cups) {
        const date = new Date(record.createdAt)
        monthly[date.getMonth()] += record.quantity
      }
    }
    return JSON.stringify(monthly, null, 2)
  }
}
