import { LitElement, html } from 'lit'
import { property } from 'lit/decorators.js'
import { SWC } from '../lib/shared/SWC';

export class xCounter extends SWC<{
  add: () => void
}>(
  'x-counter', 
  ['get:add:count'],
  LitElement) 
{
  @property({type:Number, reflect: true})
  count: number;

  render() {
    return html`
      <button @click=${this.add}>push me daddy ${this.count}</button>`
  }
} 

customElements.define('x-counter', xCounter);
declare global {
  interface HTMLElementTagNameMap {
    'x-counter': xCounter
  }
}
