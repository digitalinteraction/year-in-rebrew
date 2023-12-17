import { FluidAnimation } from '../lib/fluids.mjs'

const style = `
coffee-section {
  position: relative;
  display: block;
  
  --coffee-front: var(--color);
  --coffee-back: #8d7550;
  
  color: var(--background);
  background-color: var(--color);
}
@media (prefers-color-scheme: dark) {
  coffee-section {
    --coffee-back: #e3cfc3;
  }
}

coffee-section svg {
  color: var(--coffee-front);
  width: 100%;
  height: 100%;
  
  position: absolute;
  left: 0;
  right: 0;
  top: -5em;
  height: 5em;
  overflow: hidden;
  margin: 0 !important;
}

coffee-section #back-wave, coffee-section #wave {
  transform-origin: center;
}

coffee-section #back-wave {
  fill: var(--coffee-back);
}

coffee-section #scale line {
  stroke: #343439;
  stroke-width: 3px;
  stroke-linecap: round;
  /* mix-blend-mode: difference; */
}
`

const template = document.createElement('template')
template.innerHTML = `
  <style>${style}</style>
  <svg>
    <g>
      <path d="M 0 0 L 0 100 L 100 100 L 100 0 Z" fill="currentColor" stroke="none" id="back-wave" />
      <path d="M 0 0 L 0 100 L 100 100 L 100 0 Z" fill="currentColor" stroke="none" id="wave" />
    </g>
    <!--<g id="scale"></g>-->
  </svg>
`

export class CoffeeSection extends HTMLElement {
  animation = new FluidAnimation(this, this)

  constructor() {
    super()
    this.appendChild(template.content.cloneNode(true))
  }
  connectedCallback() {
    this.animation.begin()
  }

  static define() {
    customElements.define('coffee-section', this)
  }
}
