import { LitElement, html } from 'lit'
import { property } from 'lit/decorators.js'
import { webServerComponent } from './utils'

import {state} from '../state'

@webServerComponent('x-counter', [
  ['get:add:count', state.increment]
])
export class xCounter extends LitElement {
  @property({type:Number, reflect: true})
  count: number;

  render() {
    return html`
      <button @click=${this.add}>push me daddy ${this.count}</button>`
  }
} 

declare global {
  interface HTMLElementTagNameMap {
    'x-counter': xCounter
  }
}
