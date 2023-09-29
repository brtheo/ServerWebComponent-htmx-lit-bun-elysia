import { Context } from 'elysia';
import type { 
  HTTPVerb, 
  WiredEvent, 
  WiredProperty, 
  ComponentTag, 
  ServerComponentRoute, 
  ServerAction,
  GenericConstructor,
  ISWC,
  CustomElementClass
} from '../../../types';
import { isServer } from 'lit';
import { LitElement } from 'lit';

export function send(type: string, eventInitDict?: CustomEventInit | undefined ) {
  document.body.dispatchEvent(new CustomEvent(type, eventInitDict))
}

export const serverComponentRoutes: Array<ServerComponentRoute> = [];

export const SWCMap: Map<
  ComponentTag, 
  Map<ServerAction, [HTTPVerb, WiredEvent, WiredProperty]>
> = new Map();

export const serverComponent = 
  (componentTag: ComponentTag, serverActions: Array<ServerAction>) => 
  (proto: CustomElementClass) => {

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
    customElements.define(componentTag, proto as CustomElementConstructor);
  }
export const SWC = <T>(genericConstructor: GenericConstructor<LitElement>): GenericConstructor<T & LitElement> => {
  const anon = class extends genericConstructor {
    constructor() {
      super();
      if(!isServer) {
        const _COMPONENT_TAG_ = Array.from(this.constructor.name)
          .map((c,i) => /[A-Z]/g.test(c) && i !== 0 ? `-${c.toLowerCase()}` : c.toLowerCase()).join('')
        SWCMap.get(_COMPONENT_TAG_)?.forEach(
          ([httpVerb, action, prop]: [HTTPVerb, WiredEvent, WiredProperty] ) => {
            this[action] = (parameters: {[key:string]:any}) => send(action,{detail:{parameters}})
            this.setAttribute('hx-trigger', `${action} from:body`);
            this.setAttribute(`hx-${httpVerb}`, `/servercomponents/${_COMPONENT_TAG_}/${action}`);
            this.setAttribute('hx-swap', 'none');
            document.body.addEventListener(`${action}:res`, ({detail: {v}}: CustomEventInit) => {
              this.setAttribute(prop, typeof v === 'object' ? JSON.stringify(v): v);
            })
        })
      }
    }
  }
  return anon as GenericConstructor<T & LitElement>;
}
