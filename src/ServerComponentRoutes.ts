import { Elysia } from 'elysia';
import { serverComponentRoutes } from './components/utils';
const ServerComponentRoutes = new Elysia()
  .state('plugin-version', 1);

serverComponentRoutes.forEach(route => {
  ServerComponentRoutes[route.httpVerb](`/${route.componentTag}/${route.action}`, () => 
    new Response(null, { 'headers': 
      {'HX-Trigger': JSON.stringify(Object.fromEntries([
        [`${route.action}:res`, route.res()]
      ]))}
    })
  )
})

export default ServerComponentRoutes;