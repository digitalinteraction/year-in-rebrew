module.exports = class MemberTemplate {
  data() {
    return {
      pagination: {
        data: 'beancounter.users',
        size: 1,
        alias: 'member',
        resolve: 'values',
      },
      permalink(data) {
        return `share/${this.hash(data.member.username)}/member.json`
      },
    }
  }
  render(data) {
    return JSON.stringify(data.member, null, 2)
  }
}
