import {builder} from "../macros/build" with { type: "macro" };
import { Elysia } from "elysia";
import { staticPlugin } from '@elysiajs/static'
import { autoroutes } from "elysia-autoroutes";
import './web/registerComponents';
import SWCRoutes from './SWCRoutes';
import { R } from "./layout";
import { html } from "lit";
import {map} from 'lit/directives/map.js';

await builder();
const todos = [{_id:1,title:"foobar",completed: false},{_id:2,title:"bazbaz",completed:true}]
const app = new Elysia()
  .use(staticPlugin())
  .use(SWCRoutes)
  .use(autoroutes({
    routesDir: './routes'
  }))
  .get('/toswap', async () => R(html`
   <ul>
    ${map(todos, ({_id,title,completed}) => html`
      	<to-do 
          ._id=${_id}
          .title=${title}
          ?completed=${completed}>
        </to-do>
    `)}
   </ul>
  `))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
