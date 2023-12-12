// https://github.com/robb-j/playground/blob/main/pmtiles/tools.mjs

/** @param {(colourScheme: 'dark' | 'light') => void} callback */
export function watchColorScheme(callback) {
  if (typeof window.matchMedia !== 'function') return

  const media = window.matchMedia('(prefers-color-scheme: dark)')
  callback(media.matches ? 'dark' : 'light')

  media.addEventListener('change', (e) => {
    callback(e.matches ? 'dark' : 'light')
  })
}
