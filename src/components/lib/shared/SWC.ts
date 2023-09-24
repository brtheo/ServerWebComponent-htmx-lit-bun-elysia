import { Context } from 'elysia';
import type { 
  HTTPVerb, 
  WiredEvent, 
  WiredProperty, 
  ComponentTag, 
  ServerComponentRoute, 
  ServerAction,
  GenericConstructor
} from '../../../sharedtypes';
import { isServer } from 'lit';
import type { LitElement } from 'lit';

export function send(type: string, eventInitDict?: CustomEventInit | undefined ) {
  document.body.dispatchEvent(new CustomEvent(type, eventInitDict))
}

export const serverComponentRoutes: Array<ServerComponentRoute> = [];

export const SWC = <T>(
  componentTag: ComponentTag,
  serverActions: Array<ServerAction>, 
  genericConstructor: GenericConstructor<LitElement>
): GenericConstructor<T & LitElement> => {
  if(isServer) {
    serverActions.forEach((serverAction) => {
    const [httpVerb, action] = serverAction.split(':') as [HTTPVerb, WiredEvent, WiredProperty];
      serverComponentRoutes.push({
        httpVerb,
        componentTag,
        action,
        res: async (ctx: Context) => {
          const mod = await import(`../../${componentTag}/${componentTag}.props.ts`);
          return mod[action](ctx);
        }
      })
    })
  }
  const anonymous =  class extends genericConstructor {
    constructor() {
      super();
      serverActions.forEach((serverAction) => {
        const [httpVerb, action, prop] = serverAction.split(':') as [HTTPVerb, WiredEvent, WiredProperty];
        if(!isServer) {
          this.setAttribute('hx-trigger', `${action} from:body`);
          this.setAttribute(`hx-${httpVerb}`, `/servercomponents/${componentTag}/${action}`);
          this.setAttribute('hx-swap', 'none');
          if(httpVerb === 'post') {
            document.body.addEventListener('htmx:configRequest', (e: CustomEventInit) => 
              e.detail.headers["swc-params"] = JSON.stringify(e.detail.triggeringEvent.detail.parameters)
            )
          }
          document.body.addEventListener(`${action}:res`, ({detail: {v}}: CustomEventInit) => {
            this.setAttribute(prop, typeof v === 'object' ? JSON.stringify(v): v);
          })
        }
      }) 
    }
  }
  serverActions.forEach((serverAction) => {
    const action = serverAction.split(':').at(1)!;
    anonymous.prototype[action] = (parameters: {[key:string]:any}) =>  
      send(action,{detail:{parameters}});
  })
  return anonymous;
}