addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
  const { searchParams } = new URL(request.url);

  let oldResponse = await fetch(request)
  let newResponse = new HTMLRewriter()
    .on("script.analytics", {
      element(element) {

      },
      text(text) {
        if (searchParams.get('utm_source') == "moo") {
          text.replace(text.text.replace(/OLDPIXEL/g, 'NEWPIXEL'), { html: true });
        }
      }
    })
    .transform(oldResponse);


  return newResponse;
}
