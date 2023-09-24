import {LitElement, html, css} from 'lit'
import {customElement, property, state} from 'lit/decorators.js'

declare global {
  interface HTMLElementTagNameMap {
    'x-test':xTest
  }
}

@customElement('x-test')
export class xTest extends LitElement {
  static styles = css`
      :host {
        display: block;
        border: 3px solid white;
        border-radius: 1rem;
        padding: 1rem;
        margin: 2rem;
        color: white;
      }
    `

  render() {
    return html`
      hello from outside
      <slot></slot>
    `
  }
}