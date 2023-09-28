import { Context } from "elysia";
export const getServerProps = <T>(ctx: Context): T => 
  JSON.parse(ctx.headers['swc-params']!) as T