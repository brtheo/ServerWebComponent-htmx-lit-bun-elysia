import { Elysia } from "elysia";
import { staticPlugin } from '@elysiajs/static'
import {render} from '@lit-labs/ssr';
import {collectResult} from '@lit-labs/ssr/lib/render-result.js';
import {html} from 'lit';
import './components/xCounter'
import ServerComponentRoutes from './ServerComponentRoutes'
import {state} from './state'


await Bun.build({
  entrypoints: ['./src/components/app.ts'],
  outdir: './public',
  minify: true
})

const app = new Elysia()
  .use(staticPlugin())
  .use(ServerComponentRoutes)
  .get("/", async () => 
    new Response(
      await collectResult(
        render(html`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <script src="https://unpkg.com/htmx.org@1.9.5" integrity="sha384-xcuj3WpfgjlKF+FXhSQFQ0ZNr39ln+hwjN3npfM9VBnUskLolQAcN80McRIVOPuO" crossorigin="anonymous"></script>
            <script defer type="module" src="public/app.js"></script>
            <style>
              :root {
                background-color: black
              }
            </style>
          </head>
          <body>
            <x-counter count=${state.val}></x-counter>
          </body>
          </html>
        `)
      ), {
        'headers': {'Content-Type': 'text/html'}
      }
    )
  ).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
