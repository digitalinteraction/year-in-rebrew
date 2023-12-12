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
        return `share/${this.hash(data.member.username)}/usage.json`
      },
    }
  }
  render(data) {
    const { beans, cups } = data.member
    cups.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    beans.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    return JSON.stringify({ beans, cups }, null, 2)
  }
}
