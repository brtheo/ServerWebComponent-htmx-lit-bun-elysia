import {LitElement, html, css} from 'lit'
import {customElement, property} from 'lit/decorators.js'

declare global {
  interface HTMLElementTagNameMap {
    'to-do':TODO
  }
}

@customElement('to-do')
export class TODO extends LitElement {
  static styles = css`
      
    `
  @property({type: Number, reflect: true})
  _id: number;
  @property({type: String, reflect: true})
  title: string;
  @property({type: Boolean, reflect: true})
  completed: boolean;
  render() {
    const {_id, title, completed} = this
    return html`
      <li id=${_id}>
        ${title}
        <input type="checkbox" @change=${e => console.log("changed",e.target.checked)} ?checked=${completed}>
      </li>
    `
  }
}