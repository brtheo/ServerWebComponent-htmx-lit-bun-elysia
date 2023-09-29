import { LitElement, html } from 'lit'
import { property } from 'lit/decorators.js'
import { SWC, serverComponent } from '../../lib/shared/SWC';
@serverComponent('x-counter', ['get:add:count'])
export class xCounter extends SWC<{
  add: () => void
}>(LitElement) {
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
