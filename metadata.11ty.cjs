module.exports = class MetadataTemplate {
  data() {
    return {
      permalink: '/metadata.json',
    }
  }
  render(data) {
    const { products } = data.beancounter
    return this.json({
      totals: this.getTotals(data.beancounter),
      averageCost: this.getAverageCost(
        data.beancounter,
        data.config.pricePerKilogram
      ),
      monthly: this.getUsage(data.beancounter),
      products: Object.values(data.beancounter.products).map((p) => ({
        id: p.id,
        label: p.label,
        count: p.usage.length,
      })),
    })
  }

  getTotals(beancounter) {
    let cups = 0
    let beans = 0

    for (const member of Object.values(beancounter.users)) {
      beans += member.beans.reduce((sum, value) => sum + value.quantity, 0)
      cups += member.cups.reduce((sum, value) => sum + value.quantity, 0)
    }

    return { cups, beans }
  }

  getUsage(beancounter) {
    const monthly = Array.from({ length: 12 }, () => ({
      cups: 0,
      beans: 0,
    }))
    for (const member of Object.values(beancounter.users)) {
      for (const record of member.beans) {
        const date = new Date(record.createdAt)
        monthly[date.getMonth()].beans += record.quantity
      }
      for (const record of member.cups) {
        const date = new Date(record.createdAt)
        monthly[date.getMonth()].cups += record.quantity
      }
    }
    return monthly
  }

  getAverageCost(beancounter, pricePerKilogram) {
    const { cups, beans } = this.getTotals(beancounter)
    return ((beans / 1000) * pricePerKilogram) / cups
  }
}
