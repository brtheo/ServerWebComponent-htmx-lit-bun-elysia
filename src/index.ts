import {builder} from "../macros/build" with { type: "macro" };
import { Elysia } from "elysia";
import { staticPlugin } from '@elysiajs/static'
import { autoroutes } from "elysia-autoroutes";
import './components/registerComponents';
import SWCRoutes from './SWCRoutes';

await builder();

const app = new Elysia()
  .use(staticPlugin())
  .use(SWCRoutes)
  .use(autoroutes({
    routesDir: './routes'
  }))
  
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
