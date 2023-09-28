import {html} from 'lit';
import { layout } from '../layout';
import {count} from '../db';
export const get = async () => layout({
  body: html`
    <x-counter count=${count()}></x-counter>
    <div class="square"></div>
  `
});