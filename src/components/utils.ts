import type { 
  HTTPVerb, 
  WiredEvent, 
  WiredProperty, 
  Handler, 
  ComponentTag, 
  ServerComponentRoute, 
  ServerAction,
  CustomElementClass
} from '../sharedtypes';
import { isServer } from 'lit';

export function send(type: string, eventInitDict?: EventInit | undefined ) {
  document.body.dispatchEvent(new Event(type, eventInitDict))
}

export const serverComponentRoutes: Array<ServerComponentRoute> = [];


export const webServerComponent = (
  componentTag: ComponentTag,
  serverActions: Array<[ServerAction, Handler]>
) => (proto: CustomElementClass) => {
    customElements.define(componentTag, proto as CustomElementConstructor);
    serverActions.forEach(([serverAction, handler]) => {
      const [httpVerb, action, prop] = serverAction.split(':') as [HTTPVerb, WiredEvent, WiredProperty];
      if(isServer) {
        serverComponentRoutes.push({
          httpVerb,
          componentTag,
          action,
          res: () => handler()
        })
      } else {
        const self = document.querySelector(componentTag);    
        proto.prototype.constructor.prototype[action] = () => send(action);
        self!.setAttribute('hx-trigger', `${action} from:body`);
        self!.setAttribute(`hx-${httpVerb}`, `/${componentTag}/${action}`);
        self!.setAttribute('hx-swap', 'none');
        document.body.addEventListener(`${action}:res`, (e) => 
          self!.setAttribute(prop, (e as CustomEvent).detail.value)
        )
      }
    });   
    return proto as any;
  }