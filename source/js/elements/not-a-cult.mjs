import { Application, Sprite, Texture } from 'pixi.js'
import { DropShadowFilter } from '@pixi/filter-drop-shadow'
import { Orbital } from './usage-planet.mjs'
import { watchColorScheme } from '../lib/dark-mode.mjs'

const RADIUS = 280
const ANIMATION_DURATION = 3_000

const WIDTH = 640
const HEIGHT = 320

export class NotACult extends HTMLElement {
  app = new Application({
    width: WIDTH,
    height: HEIGHT,
    backgroundAlpha: 0,
  })
  colorScheme = 'light'

  /** @type {Sprite|null} */ icon = null
  /** @type {Orbital[]} */ orbitals = []
  /** @type {Map<string,Texture>} */ textures = new Map()

  static define() {
    customElements.define('not-a-cult', this)
  }

  constructor() {
    super()
    this.app.stage.sortableChildren = true
    this.app.renderer.events.autoPreventDefault = false
    this.app.view.style.touchAction = 'auto'
    this.appendChild(this.app.view)

    watchColorScheme((value) => {
      this.colorScheme = value
      this.render()
    })
    this.app.ticker.add((dt) => this.tick(dt))
  }

  pause(ms) {
    return new Promise((r) => setTimeout(r, ms))
  }

  async render() {
    const urls = this.getAttribute('headshots')?.split(',') ?? []
    const duration = ANIMATION_DURATION / urls.length

    const texture = await this.loadTexture(
      `/assets/img/bean-${this.colorScheme}.png`,
    )

    const sprite = this.icon ?? new Sprite(texture)
    sprite.texture = texture
    sprite.position.set(WIDTH / 2, HEIGHT / 2 - 40)
    sprite.width = texture.width * 1.5
    sprite.height = texture.height * 1.5
    sprite.anchor.set(0.5, 0.5)

    // const shadow = new DropShadowFilter()
    // shadow.color = 0x6760bf
    // shadow.alpha = 0.5
    // shadow.blur = 30
    // shadow.distance = 0
    // sprite.filters = [shadow]

    if (!this.icon) {
      this.icon = sprite
      this.app.stage.addChild(sprite)
    }

    for (const [i, url] of urls.entries()) {
      const promise = this.loadTexture(url)
      await Promise.all([promise, this.pause(duration)])
      const texture = await promise

      const sprite = new Sprite(texture)
      sprite.anchor.set(0.5, 0.5)
      sprite.width = 56
      sprite.height = 56
      this.app.stage.addChild(sprite)
      this.orbitals.push(new Orbital(sprite, 0, 30, i / urls.length, RADIUS))
    }
  }

  tick() {
    let now = Date.now()
    for (const o of this.orbitals) o.update(now)

    if (this.icon) {
      this.icon.rotation = Math.tan(now * 0.002)
    }
  }

  async loadTexture(url) {
    let texture = this.textures.get(url)
    if (texture) return texture
    texture = await Texture.fromURL(url)
    this.textures.set(url, texture)
    return texture
  }
}
