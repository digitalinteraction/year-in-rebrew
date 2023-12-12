module.exports = class MonthlyCupsTemplate {
  data() {
    return {
      pagination: {
        data: 'beancounter.users',
        size: 1,
        alias: 'member',
        resolve: 'values',
      },
      permalink(data) {
        return `share/${this.hash(data.member.username)}/monthly-cups.json`
      },
    }
  }
  render(data) {
    const monthly = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (const record of data.member.cups) {
      const date = new Date(record.createdAt)
      monthly[date.getMonth()] += record.quantity
    }
    return JSON.stringify(monthly, null, 2)
  }
}
