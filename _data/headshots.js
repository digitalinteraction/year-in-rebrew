const fs = require('node:fs/promises')
const eleventyFetch = require('@11ty/eleventy-fetch')
const sharp = require('sharp')
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

    const rect = Buffer.from(
      `<svg><rect x="0" y="0" width="256" height="256" rx="128" ry="128"/></svg>`,
    )

    const image = await sharp(imageBuffer)
      .resize(256, 256)
      .composite([{ input: rect, blend: 'dest-in' }])
      .webp()
      .toBuffer()

    const path = `/headshots/${username}.webp`
    await fs.writeFile(`_site${path}`, image)
    data[member.username] = path
  }
  return data
}
