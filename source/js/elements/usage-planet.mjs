import { Application, Sprite, Texture, Graphics } from 'pixi.js'

const WIDTH = 640
const HEIGHT = 300

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
    const t = timeElapsed * 0.0005 + this.tOffest * Math.PI

    this.sprite.zIndex = Math.cos(t) > 0 ? 1 : -1
    this.sprite.position.x = WIDTH * 0.5 + this.xOffset + Math.sin(t) * this.r
    this.sprite.position.y =
      HEIGHT * 0.5 + this.yOffset + Math.cos(t) * this.r * 0.3333
  }
}

export function random(min, max) {
  return min + Math.random() * Math.abs(max - min)
}

function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class UsagePlanet extends HTMLElement {
  app = new Application({
    width: WIDTH,
    height: HEIGHT,
    backgroundAlpha: 0,
  })
  imageMask = new Graphics()
  colourMask = new Graphics()

  /** @type {Orbital[]} */ orbitals = []

  textures = {
    cup: Texture.fromURL('/assets/img/cup.png'),
    bean: Texture.fromURL('/assets/img/bean.png'),
  }

  static define() {
    customElements.define('usage-planet', this)
  }

  connectedCallback() {
    const imageSrc = this.getAttribute('image')
    const cups = parseInt(this.getAttribute('cups')) || 0
    const bags = parseInt(this.getAttribute('bags')) || 0

    this.app.stage.sortableChildren = true

    const color = getComputedStyle(document.body).getPropertyValue('--color')
    this.colourMask.beginFill(color)
    this.colourMask.drawRect(0, 0, WIDTH, HEIGHT)

    this.imageMask.beginFill(0x000000)
    this.imageMask.drawEllipse(WIDTH / 2, HEIGHT / 2, 100, 100)

    const image = Sprite.from(imageSrc)
    image.position.x = WIDTH * 0.5
    image.position.y = HEIGHT * 0.5
    image.anchor.x = 0.5
    image.anchor.y = 0.5
    image.width = 200
    image.height = 200
    image.zIndex = 0
    image.mask = this.imageMask
    this.app.stage.addChild(image)
    this.image = image

    this.appendChild(this.app.view)

    // for (let i = 0; i < cups; i++) this.addCup()
    // for (let i = 0; i < bags; i++) this.addBean()

    this.app.ticker.add((dt) => this.tick(dt))

    this.addOrbits(cups, bags)
  }

  async addOrbits(cups, bags) {
    for (let i = 0; i < bags; i++) {
      this.addBean()
      await pause(1000 / (bags || 1))
    }
    await pause(1000)
    for (let i = 0; i < cups; i++) {
      this.addCup()
      await pause(2000 / (cups || 1))
    }
  }

  addCup() {
    const sprite = Sprite.from('/assets/img/cup.png')
    sprite.width = 17
    sprite.height = 12
    sprite.anchor.x = 0.5
    sprite.anchor.y = 0.5
    this.app.stage.addChild(sprite)
    this.orbitals.push(
      new Orbital(sprite, random(-40, 40), random(-40, 40), random(-1, 1), 180),
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
      new Orbital(sprite, random(-20, 20), random(-20, 20), random(-1, 1), 280),
    )
  }

  /** @param {number} dt */
  tick(dt) {
    let now = Date.now()
    for (const o of this.orbitals) o.update(now)

    this.image.rotation = Math.sin(now * 0.002) * 0.1
  }
}
