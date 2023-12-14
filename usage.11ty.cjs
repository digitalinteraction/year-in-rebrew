module.exports = class UsageTemplate {
  data() {
    return {
      permalink: '/usage.json',
    }
  }
  render(data) {
    const cups = []
    const beans = []

    for (const member of Object.values(data.beancounter.users)) {
      cups.push(...member.cups)
      beans.push(...member.beans)
    }

    cups.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    beans.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    return JSON.stringify({ beans, cups }, null, 2)
  }
}
