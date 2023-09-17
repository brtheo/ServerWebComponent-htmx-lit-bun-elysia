export type HTTPVerb = 'get' | 'post' | 'put' | 'delete' | 'patch';
export type WiredEvent = string;
export type WiredProperty = string;
export type Handler = () => any
export type ComponentTag = `${string}-${string}`;
export type ServerAction = `${HTTPVerb}:${WiredEvent}:${WiredProperty}`;
export type CustomElementClass = Omit<typeof HTMLElement, 'new'>;
export type ServerComponentRoute = {
  httpVerb: HTTPVerb,
  action: WiredEvent,
  componentTag: ComponentTag,
  res: () => any
};