require('dotenv/config')
const { createHmac } = require('node:crypto')
const fs = require('node:fs')

const eleventyWebc = require('@11ty/eleventy-plugin-webc')
const { eleventyAlembic } = require('@openlab/alembic/11ty')

const { HUB_API_TOKEN, URL_HASH_SECRET } = process.env

// if (!HUB_API_TOKEN) {
//   console.error('HUB_API_TOKEN not set')
//   process.exit(1)
// }

if (!URL_HASH_SECRET) {
  console.error('URL_HASH_SECRET not set')
  process.exit(1)
}

const beancounter = require('./_data/beancounter.json')

function hash(value) {
  return createHmac('sha256', URL_HASH_SECRET).update(value).digest('base64url')
}

module.exports = function (eleventyConfig) {
  eleventyConfig.setQuietMode(true)

  eleventyConfig.addPlugin(eleventyWebc)
  eleventyConfig.addPlugin(eleventyAlembic, { useLabcoat: true })

  eleventyConfig.addPassthroughCopy('assets')
  eleventyConfig.addFilter('json', (value) => JSON.stringify(value, null, 2))
  eleventyConfig.addFilter('hash', (value) => hash(value))
  eleventyConfig.on('eleventy.after', () => {
    const file = fs.createWriteStream('members.csv')
    file.write('username,hash\n')
    for (const member of Object.values(beancounter.users)) {
      file.write(member.username + ',' + hash(member.username) + '\n')
    }
    file.close()
  })
}
