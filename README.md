# Elysia + Bun + HTMX + Lit = Server Web Component

This repo is mainly a POC to demonstrate a server event driven reactive application using both the powers of HTMX and Web Component.

## How it works
In a Lit Web Component we can decorate class properties (in our case) :
* ensure type safety
* bind it to a component's HTML attribute
* observe any changes of the prop/attr and react to it by a rerender

In the `index.ts` file, we first render `<x-counter count=${state.val}></x-counter>` to give the prop/attr an initial value.

The `xCounter` class itself is decorated with `@webServerComponent(tagName: string, serverActions: Array<[ServerAction, Handler]>)`, it produces same behaviour as `@customElement(tagName: string)` as it will register the custom element in the registry but in addition it'll do two things : 
* create HTMX routes that will respond back with an event of type `<original event name>:res` containing the return value of the `Handler` function
* attach beloved HTMX attributes to the Web Component

```typescript
export type ServerAction = `${HTTPVerb}:${WiredEvent}:${WiredProperty}`;
@webServerComponent('x-counter', [
  ['get:add:count', state.increment]
])
export class xCounter extends LitElement {
  ...
```
This example will produce the following 

On the server :
```typescript
new Elysia().get('/x-counter/add', () => 
  new Response(null, { 
    headers: {
      'HX-Trigger': JSON.stringify({
        'add:res': handler() // updated value to reflect back to the component's attribute
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
