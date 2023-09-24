import { Context } from "elysia";
import { LitElement } from "lit";
import { z } from "zod";
export type LitElementConstructor = new (...args: any[]) => LitElement
export type GenericConstructor<T> = new (...args: any[]) => T
export type HTTPVerb = 'get' | 'post' | 'put' | 'delete' | 'patch';
export type WiredEvent = string;
export type WiredProperty = string;
export type Handler = () => any
export type ComponentTag = `${string}-${string}`;
export type ServerAction = `${HTTPVerb}:${WiredEvent}:${WiredProperty}`;
export type ServerComponentRoute = {
  httpVerb: HTTPVerb,
  action: WiredEvent,
  componentTag: ComponentTag,
  res: (ctx: Context) => Promise<any>
};

export const PostProps =  z.object({
  id: z.number()
});

export type PostProps = z.infer<typeof PostProps>;