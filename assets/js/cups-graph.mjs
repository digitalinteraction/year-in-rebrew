import { Application, Sprite, Texture } from './pixi.mjs'

const WIDTH = 640
const HEIGHT = 360

export class Orbital {
  /**
    @param {Sprite} sprite 
    @param {number} xOffset
    @param {number} yOffset
    @param {number} tOffest
  */
  constructor(sprite, xOffset, yOffset, tOffest) {
    this.sprite = sprite
    this.xOffset = xOffset
    this.yOffset = yOffset
    this.tOffest = tOffest
  }
  /** @param {number} timeElapsed */
  update(timeElapsed) {
    const t = timeElapsed * 0.0005 + this.tOffest * Math.PI

    this.sprite.zIndex = Math.cos(t) > 0 ? 1 : -1
    this.sprite.position.x = WIDTH * 0.5 + this.xOffset + Math.sin(t) * 250
    this.sprite.position.y = HEIGHT * 0.5 + this.yOffset + Math.cos(t) * 50
  }
}

export function random(min, max) {
  return min + Math.random() * Math.abs(max - min)
}

export class CupsGraph extends HTMLElement {
  app = new Application({
    width: WIDTH,
    height: HEIGHT,
    backgroundAlpha: 0,
  })

  /** @type {Orbital[]} */ orbitals = []

  textures = {
    cup: Texture.fromURL('/assets/img/cup.png'),
    bean: Texture.fromURL('/assets/img/bean.png'),
  }

  static define() {
    window.customElements.define('cups-graph', this)
  }

  connectedCallback() {
    const imageSrc = this.getAttribute('image')
    const cups = parseInt(this.getAttribute('cups')) || 0
    const bags = parseInt(this.getAttribute('bags')) || 0

    console.debug('cups-graph', { imageSrc, cups, bags })

    this.app.stage.sortableChildren = true

    // TODO: work out how to make the headshot a circle

    const image = Sprite.from(imageSrc)
    image.position.x = WIDTH * 0.5
    image.position.y = HEIGHT * 0.5
    image.anchor.x = 0.5
    image.anchor.y = 0.5
    image.width = 256
    image.height = 256
    image.zIndex = 0
    this.app.stage.addChild(image)

    this.appendChild(this.app.view)

    for (let i = 0; i < cups; i++) this.addCup()
    for (let i = 0; i < bags; i++) this.addBean()

    this.app.ticker.add((dt) => this.tick(dt))
  }

  addCup() {
    const sprite = Sprite.from('/assets/img/cup.png')
    sprite.width = 17
    sprite.height = 12
    sprite.anchor.x = 0.5
    sprite.anchor.y = 0.5
    this.app.stage.addChild(sprite)
    this.orbitals.push(
      new Orbital(sprite, random(-50, 50), random(-50, 50), random(-1, 1)),
    )
  }
  addBean() {
    const sprite = Sprite.from('/assets/img/bean.png')
    sprite.width = 40
    sprite.height = 40
    sprite.anchor.x = 0.5
    sprite.anchor.y = 0.5
    this.app.stage.addChild(sprite)
    this.orbitals.push(
      new Orbital(sprite, random(-50, 50), random(-50, 50), random(-1, 1)),
    )
  }
  addOrbital(imageUrl, width, height) {
    const sprite = Sprite.from(imageUrl)
    sprite.width = width
    sprite.height = height
    sprite.anchor.x = 0.5
    sprite.anchor.y = 0.5
    this.app.stage.addChild(sprite)
    this.orbitals.push(
      new Orbital(sprite, random(-50, 50), random(-50, 50), random(-1, 1)),
    )
  }

  /** @param {number} dt */
  tick(dt) {
    let now = Date.now()
    for (const o of this.orbitals) o.update(now)
  }
}
