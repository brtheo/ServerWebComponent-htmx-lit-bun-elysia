import {render} from '@lit-labs/ssr';
import {collectResult} from '@lit-labs/ssr/lib/render-result.js';
import {HTMLTemplateResult, html} from 'lit';
export const layout = async ({body}: {body: HTMLTemplateResult}) => 
new Response(await collectResult(render(html`
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
      .square {
        width: 100px;
        height: 100px;
        background: red;
      }
      blog-article::part(article):hover {
        background-color: red;
      }
      blog-article::part(active){
        background-color: yellow;
      }
    </style>
  </head>
  <body>
    <nav>
      <ul>
        <li><a href="/">home</a></li>
        <li><a href="/blog">blog</a></li>
      </ul>
    </nav>
    ${body}
  </body>
  </html>
`)),{'headers': {'Content-Type': 'text/html'}});
