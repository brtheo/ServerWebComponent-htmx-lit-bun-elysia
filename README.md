# Elysia + Bun + HTMX + Lit = Server Web Component

This repo is mainly a POC to demonstrate a server event driven reactive application using both the powers of HTMX and Web Components.

## How it works

### Attributes update
In a Lit Web Component we can decorate class properties to (in our case) :
* ensure type safety
* bind it to a component's HTML attribute
* observe any update of the attribute's value and react to it

In the `routes/index.ts` file, we first render a web component ` <x-counter count=${count()}></x-counter>` to give the attribute an initial value read from database.

The `xCounter` class itself is decorated with `@serverComponent()` and is extending the mixin `SWC`
```typescript
export type ServerAction = `${HTTPVerb}:${WiredEvent}:${WiredProperty}`;
export const serverComponent(componentTag: ComponentTag, serverActions: Array<ServerAction>)
...
export const SWC = <T>(genericConstructor: GenericConstructor<LitElement>): GenericConstructor<T & LitElement>
...
```
What it'll do : 
* Register custom element
* create HTMX routes that will respond back with an event of type `<original event name>:res` containing the return value of an exported function of the same name as the one we've provided as the `WiredEvent` type. The function will need to be place in a `x-counter.props.ts` file.
* attach HTMX attributes to the Web Component

```typescript
//x-counter.props.ts
import {db, count} from '../../../db';
export const add = () => {
  db.prepare("UPDATE counter SET count = ?").run(count()+1);
  return count();
} 
//x-counter.ts
@serverComponent('x-counter', ['get:add:count'])
export class xCounter extends SWC<{
  add: () => void
}>(LitElement) {
  ...
```
This example will produce the following 

On the server :
```typescript
new Elysia().get('/x-counter/add', async () => 
  new Response(null, { 
    headers: {
      'HX-Trigger': JSON.stringify({
        'add:res': await methodFromDynamicModule() // exported method in x-counter.props.ts file
      )}
    }
  })
)
```

On the client : 
```html
<x-counter
  hx-get="/x-counter/add"
  hx-trigger="add from:body"
  hx-swap="none"
><x-counter>
<script>
  document.body.addEventListener(`add:res`, e => 
    xCounter.setAttribute('count', e.detail.value)
  );
</script>
```
It also creates an `add()` method dynamically attached to the `xCounter` class, that sends an event of type `add` onto the `body` element of the page to trigger the `hx-trigger` attribute requirements we've set.

We can use it like this in our component : 
```typescript
render() {
  return html`
    <button @click=${this.add}>push me daddy ${this.count}</button>`
}
```

### Post request
To do a post request, just pass any object you want to be sent, as a parameter of the method corresponding to the `WiredEvent` type you've chose.
```typescript
@serverComponent('blog-article', ['post:fetchblogpost:post'])
export class BlogArticle extends SWC<{
  fetchblogpost: (params: TPostProps) => void
}>(LitElement) {
```
In this example, we've defined our `WiredEvent` to be `fetchblogpost`, meaning that a method of the same name will be sending an event of the same name, will be accecible on the class `BlogArticle`.
The parameters you pass to the `fetchblogpost()` method will be sent to the server over custom headers utilizing `htmx:configRequest` `customEvent`. On the server, those parameters will be workable with in an exported method, again of the same name of the initial `WiredEvent` , in a `blog-article.props.ts` file.
And it's typesafe from client to server.
```typescript
export const fetchblogpost = async(ctx: Context) => {
  const {id} = getServerProps<TPostProps>(ctx);
  return (
    await (
      await fetch('https://jsonplaceholder.typicode.com/posts/'+id)
    ).json()
  );
}
```

### HTML response
As of right now, HTMX doesn't support shadow dom, but still we can take advantage of `<slot>` element to swap HTML response in the innerHTML of our Web Component for example.
```typescript
//x-swapped.ts
@customElement('x-swapped')
export class xSwapped extends LitElement {
  render() {
    return html`
      hello from outside, inner will be swapped
      <slot></slot>
    `
  }
}
//somepath.ts
export const get = async () => layout({
  body: html`
    <button>load todos</button>
    <x-swapped hx-get="/toswap" hx-trigger="click from:button" hx-swap="innerHTML">
    </x-swapped>
  `
});
//routes.ts
const app = new Elysia()
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
```

In this example we see that the `<to-do>` Web Compopnent, even though being rendered by HTMX, will be both executed on the server and correctly hydrated once on the client side.
