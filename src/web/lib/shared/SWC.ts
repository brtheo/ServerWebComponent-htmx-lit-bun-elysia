import { Context } from 'elysia';
import type { 
  HTTPVerb, 
  WiredEvent, 
  WiredProperty, 
  ComponentTag, 
  ServerComponentRoute, 
  ServerAction,
  GenericConstructor
} from '../../../types';
import { isServer } from 'lit';
import { LitElement } from 'lit';
export type CustomElementClass = Omit<typeof HTMLElement, 'new'>;
export function send(type: string, eventInitDict?: CustomEventInit | undefined ) {
  document.body.dispatchEvent(new CustomEvent(type, eventInitDict))
}

export const serverComponentRoutes: Array<ServerComponentRoute> = [];

export const SWCMap: Map<
  ComponentTag, 
  Map<ServerAction, [HTTPVerb, WiredEvent, WiredProperty]>
> = new Map();

export const SWC = <T>(
  componentTag: ComponentTag,
  serverActions: Array<ServerAction>, 
  genericConstructor: GenericConstructor<LitElement>
): GenericConstructor<T & LitElement> => {
  serverActions.forEach((serverAction: ServerAction) => {
    if(!SWCMap.has(componentTag)) 
      SWCMap.set(
        componentTag, 
          new Map([[
            serverAction, 
            [...serverAction.split(':')]  as [HTTPVerb, WiredEvent, WiredProperty]
          ]])
        
      );
    else SWCMap.get(componentTag)!.set(
      serverAction, 
      [...serverAction.split(':')]  as [HTTPVerb, WiredEvent, WiredProperty]
    );
  })
  
  if(isServer) {
    SWCMap.get(componentTag)?.forEach(([httpVerb, action]) => {
      serverComponentRoutes.push({
        httpVerb,
        componentTag,
        action,
        res: async (ctx: Context) => {
          const mod = await import(`../../components/${componentTag}/${componentTag}.props.ts`);
          return mod[action](ctx);
        }
      })
    })
  } 
  
  const anonymous = class extends genericConstructor {
    constructor() {
      super();
      if(!isServer) {
        SWCMap.get(componentTag)?.forEach(
          ([httpVerb, action, prop]: [HTTPVerb, WiredEvent, WiredProperty] ) => {
            this.setAttribute('hx-trigger', `${action} from:body`);
            this.setAttribute(`hx-${httpVerb}`, `/servercomponents/${componentTag}/${action}`);
            this.setAttribute('hx-swap', 'none');
            document.body.addEventListener(`${action}:res`, ({detail: {v}}: CustomEventInit) => {
              this.setAttribute(prop, typeof v === 'object' ? JSON.stringify(v): v);
            })
        })
      } 
    }
  }

  if(!isServer) {
    SWCMap.get(componentTag)?.forEach(([,action]) =>
    anonymous.prototype[action]  = (parameters: {[key:string]:any}) =>  
        send(action,{detail:{parameters}})
    )
  }
  return anonymous;
}