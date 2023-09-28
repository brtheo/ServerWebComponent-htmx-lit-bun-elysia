document.body.addEventListener('htmx:configRequest', (e: CustomEventInit) => {
  if(e.detail.verb === 'post') {
    e.detail.headers["swc-params"] = JSON.stringify(e.detail.triggeringEvent.detail.parameters)
  }
})