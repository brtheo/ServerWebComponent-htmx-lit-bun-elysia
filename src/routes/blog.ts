import {html} from 'lit';
import { layout } from '../layouts';
const post = {
  title: "hello world",
  body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, minima neque numquam ipsa quia aperiam totam expedita ducimus repudiandae, animi ullam quisquam eaque aliquid assumenda odio exercitationem reiciendis quaerat harum?",
  userId: 1,
  id: 1
}
export const get = async () => layout({
  body: html`
    <div style="margin-left:350px; background-color: blue" class="square"></div>
    <blog-article .post=${post} ></blog-article>
    <button>test</button>
    <x-test hx-get="/test" hx-trigger="click from:button" hx-swap="innerHTML">
    </x-test>
  `
});