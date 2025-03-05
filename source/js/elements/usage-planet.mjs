import { Application, Sprite, Texture, BLEND_MODES } from 'pixi.js'
import { watchColorScheme } from '../lib/dark-mode.mjs'

const WIDTH = 640
const HEIGHT = 300

const startOfYear = new Date('2024-01-01')
const endOfYear = new Date('2025-01-01')
const msPerDay = 24 * 60 * 60 * 1_000

const CUPS_DURATION = 4_000
const BEANS_DURATION = 2_000

const CUP_RADIUS = 180
const BEAN_RADIUS = 280

const CUP_SPREAD = 120
const BEAN_SPREAD = 50

/**
 * @typedef {object} Resource
 * @property {string} createdAt
 * @property {string} resource
 * @property {number} quantity
 */

export class Orbital {
  /**
    @param {Sprite} sprite 
    @param {number} xOffset
    @param {number} yOffset
    @param {number} tOffest
    @param {number} r
  */
  constructor(sprite, xOffset, yOffset, tOffest, r) {
    this.sprite = sprite
    this.xOffset = xOffset
    this.yOffset = yOffset
    this.tOffest = tOffest
    this.r = r
  }
  /** @param {number} timeElapsed */
  update(timeElapsed) {
    const t = timeElapsed * 0.0005 + this.tOffest * Math.PI * 2

    // this.sprite.zIndex = Math.cos(t) > 0 ? 1 : -1
    this.sprite.zIndex = Math.cos(t)
    this.sprite.position.x = WIDTH * 0.5 + this.xOffset + Math.sin(t) * this.r
    this.sprite.position.y =
      HEIGHT * 0.5 + this.yOffset + Math.cos(t) * this.r * 0.3333
  }
}

export function random(min, max) {
  return min + Math.random() * Math.abs(max - min)
}

export function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * @param {Date} input
 * @param {Date} startOfYear
 * @param {Date} endOfYear
 */
export function percentThroughYear(input, startOfYear, endOfYear) {
  const ms = input.getTime() - startOfYear.getTime()
  return ms / (endOfYear.getTime() - startOfYear.getTime())
}

export function spread(input, value) {
  return input * value * 2 - value
}

export class UsagePlanet extends HTMLElement {
  app = new Application({
    width: WIDTH,
    height: HEIGHT,
    backgroundAlpha: 0,
    eventMode: 'passive',
  })
  colorScheme = 'light'

  /** @type {Orbital[]} */ orbitals = []

  textures = {}

  static define() {
    customElements.define('usage-planet', this)
  }

  constructor() {
    super()
    this.app.stage.sortableChildren = true
    this.app.renderer.events.autoPreventDefault = false
    this.app.view.style.touchAction = 'auto'
    this.appendChild(this.app.view)

    watchColorScheme((scheme) => {
      this.colorScheme = scheme
    })

    this.app.ticker.add((dt) => this.tick(dt))
  }

  async connectedCallback() {
    await this.loadTextures()
    await this.render()
  }

  async loadTextures() {
    this.textures = {
      orb: await Texture.fromURL('/assets/img/orb.png'),
      light: {
        cup: await Texture.fromURL('/assets/img/cup-light.png'),
        bean: await Texture.fromURL('/assets/img/bean-light.png'),
      },
      dark: {
        cup: await Texture.fromURL('/assets/img/cup-dark.png'),
        bean: await Texture.fromURL('/assets/img/bean-dark.png'),
      },
    }
  }

  async render() {
    const endpoint = this.getAttribute('endpoint')

    const data = await fetch(endpoint)
      .then((r) => r.json())
      .catch(() => null)

    if (!data) {
      console.error('<usage-planet> Failed to fetch data')
      return
    }
    const { cups, beans } = data

    const color = getComputedStyle(document.body).getPropertyValue('--color')

    if (!this.image && this.hasAttribute('image')) {
      const image = Sprite.from(this.getAttribute('image'))
      image.position.x = WIDTH * 0.5
      image.position.y = HEIGHT * 0.5
      image.anchor.x = 0.5
      image.anchor.y = 0.5
      image.width = 200
      image.height = 200
      image.zIndex = 0
      this.app.stage.addChild(image)
      this.image = image
    }
    if (!this.orb && this.hasAttribute('image')) {
      const orb = new Sprite(this.textures.orb)
      orb.position.x = WIDTH * 0.5
      orb.position.y = HEIGHT * 0.5
      orb.anchor.x = 0.5
      orb.anchor.y = 0.5
      orb.height = 200
      orb.width = 200
      orb.zIndex = 0
      orb.alpha = 0.75
      this.app.stage.addChild(orb)
      this.orb = orb
    }

    this.addOrbits(cups, beans)
  }

  /**
   * @param {Resource[]} cups
   * @param {Resource[]} beans
   */
  async addOrbits(cups, beans) {
    for (const record of beans) {
      const t = percentThroughYear(
        new Date(record.createdAt),
        startOfYear,
        endOfYear,
      )
      this.addBean(t)
      await pause(BEANS_DURATION / (beans.length || 1))
    }

    await pause(1000)
    for (const record of cups) {
      const date = new Date(record.createdAt)
      const t = percentThroughYear(date, startOfYear, endOfYear)
      const u = (date.getTime() % msPerDay) / msPerDay
      this.addCup(t, u)
      await pause(CUPS_DURATION / (cups.length || 1))
    }
  }

  addCup(t, y = random(0, 1)) {
    const sprite = new Sprite(this.textures[this.colorScheme].cup)
    sprite.width = 20
    sprite.height = 14.4
    sprite.anchor.x = 0.5
    sprite.anchor.y = 0.5
    if (this.hasAttribute('blend')) {
      sprite.alpha = 0.5
      sprite.blendMode = BLEND_MODES.HUE
    }
    this.app.stage.addChild(sprite)
    this.orbitals.push(
      new Orbital(
        sprite,
        random(-40, 40),
        spread(y, CUP_SPREAD),
        t,
        CUP_RADIUS,
      ),
    )
  }
  addBean(t) {
    const sprite = new Sprite(this.textures[this.colorScheme].bean)
    sprite.width = 32
    sprite.height = 46
    sprite.anchor.x = 0.5
    sprite.anchor.y = 0.5
    if (this.hasAttribute('blend')) {
      sprite.alpha = 0.8
      sprite.blendMode = BLEND_MODES.HUE
    }
    this.app.stage.addChild(sprite)
    this.orbitals.push(new Orbital(sprite, 0, 0, t, BEAN_RADIUS))
  }

  tick(_dt) {
    let now = Date.now()
    for (const o of this.orbitals) o.update(now)

    if (this.image) {
      this.image.rotation = Math.sin(now * 0.002) * 0.05
    }
  }
}
