module.exports = function (eleventyConfig) {
  const data = new Map()

  eleventyConfig.on('eleventy.before', () => {
    data.clear()
  })

  // eleventyConfig.

  eleventyConfig.addShortcode('alembicCss', (url, id, css) => {
    const record = data.get(url) || []
    record.push({ id, css })

    if (!data.has(url)) data.set(url, record)

    console.log(data)
  })
}
