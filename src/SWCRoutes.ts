import { Elysia } from 'elysia';
import { serverComponentRoutes } from './web/lib/shared/SWC';
const SWCRoutes = new Elysia();

serverComponentRoutes.forEach(route => {
  SWCRoutes[route.httpVerb](`/servercomponents/${route.componentTag}/${route.action}`, async (ctx) => 
    new Response(null, { 'headers': 
      {'HX-Trigger': JSON.stringify(Object.fromEntries([
        [`${route.action}:res`, {v:await route.res(ctx)}]
      ]))}
    }), {
      beforeHandle: ({set, request: {headers}}) => {
        if(!headers.has('hx-request')) {
          set.status = 401;
          return 'Bad request';
        }
      }
    }
)
})

export default SWCRoutes;