const fs = require('node:fs/promises')
const eleventyFetch = require('@11ty/eleventy-fetch')
const config = require('./config.json')
const beancounter = require('./beancounter.json')

module.exports = async function () {
  const data = {}
  await fs.mkdir('_site/headshots', { recursive: true })
  for (const member of Object.values(beancounter.users)) {
    if (config.headshotRemaps[member.username] === null) {
      console.log('[headshots] skip: ' + member.username)
      continue
    }
    const username = config.headshotRemaps[member.username] ?? member.username

    const url = `https://hub.openlab.dev/api/openlab-website/v1/headshot/${username}`

    const imageBuffer = await eleventyFetch(url, {
      duration: '30d',
      type: 'buffer',
    }).catch(() => null)

    if (!imageBuffer) {
      console.log('[headshots] not found: ' + url)
      continue
    }

    const path = `/headshots/${username}.jpg`
    await fs.writeFile(`_site${path}`, imageBuffer)
    data[member.username] = path
  }
  return data
}
