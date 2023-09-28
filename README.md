# Elysia + Bun + HTMX + Lit = Server Web Component

This repo is mainly a POC to demonstrate a server event driven reactive application using both the powers of HTMX and Web Component.

## How it works

### Attributes update
In a Lit Web Component we can decorate class properties to (in our case) :
* ensure type safety
* bind it to a component's HTML attribute
* observe any changes of the prop/attr and react to it by a rerender

In the `routes/index.ts` file, we first render a web component `<x-counter count=${state.val}></x-counter>` to give the prop/attr an initial value.

The `xCounter` class itself is extending the mixin `SWC`
```typescript
export const SWC = <T>(
  componentTag: ComponentTag,
  serverActions: Array<ServerAction>, 
  genericConstructor: GenericConstructor<LitElement>
): GenericConstructor<T & LitElement>
```
It it'll do two things : 
* create HTMX routes that will respond back with an event of type `<original event name>:res` containing the return value of the `Handler` function
* attach beloved HTMX attributes to the Web Component

```typescript
@customElement('x-counter')
export class xCounter extends SWC<{
  add: () => void
}>(
  'x-counter', 
  ['get:add:count'],
  LitElement)
{
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
It also creates an `add()` method dynamically attached to the `xCounter` class, that send an event of type `add` onto the `body` element of the page to trigger the `hx-trigger` attribute requirements we've set.

We can use it like this in our component : (this layer of abstraction may not be relevant but ... who cares)
```typescript
render() {
  return html`
    <button @click=${this.add}>push me daddy ${this.count}</button>`
}
```

### HTML response swapping
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
