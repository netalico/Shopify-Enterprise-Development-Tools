addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
  let oldResponse = await fetch(request)
  let newResponse = new HTMLRewriter()
    .on("head", {
      element(element) {
        element.append(' <script src="#" />', { html: true });
      },
    })
    .transform(oldResponse);

    
  return newResponse;
}
