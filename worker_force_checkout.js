async function handleRequest(request) {
  const requestURL = new URL(request.url);
  const { searchParams } = new URL(request.url);
  if ((searchParams.get('skip_shopify_pay') != 'true')
    && (request.headers.get("Referer") == "https://{REPLACE_WITH_DOMAIN}/cart")
  ) {
      let url = new URL(request.url);
        let params = new URLSearchParams(url.search.slice(1));
        params.append('skip_shopify_pay', 'true');
        url.search = params;
        return Response.redirect(url, 302)
  }

  // If request not in map, return the original request
  return fetch(request);
}

addEventListener("fetch", async event => {
  event.respondWith(handleRequest(event.request))
})
