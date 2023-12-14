module.exports = class MonthlyBeansTemplate {
  data() {
    return {
      permalink: '/monthly-beans.json',
    }
  }
  render(data) {
    const monthly = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (const member of Object.values(data.beancounter.users)) {
      for (const record of member.beans) {
        const date = new Date(record.createdAt)
        monthly[date.getMonth()] += record.quantity / 1000
      }
    }
    return JSON.stringify(monthly, null, 2)
  }
}
